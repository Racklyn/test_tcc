from langchain.prompts import ChatPromptTemplate
from langchain_core.utils.function_calling import convert_to_openai_function
from model import llm
from mocks.publications_dump import publications
from typing import Optional, Union
from pydantic import BaseModel, Field
from entities.brand import Brand
from entities.item import Item
from entities.post_comment import Post, Comment
from datetime import datetime
from services import post_service, item_service, comment_analysis_service
from math import ceil


class InfoAboutPost(BaseModel):
    ''' Classe contendo informações sobre a publicação '''

    post_type: str = Field(description='Indica se a publicação trata especificamente sobre um produto, sobre um serviço ou outro. Terá um dos valores: "product", "service" ou "other"')
    summary: str = Field(description='Resumo com até 120 caracteres do conteúdo da publicação')

def get_info_about_post(post: Post, brand: Brand) -> InfoAboutPost:
    if not post.content or len(post.content) == 0:
        return InfoAboutPost(post_type='other', summary='')

    prompt = ChatPromptTemplate(
        [
            (
                'system',
                '''
                    Você é um assistente que receberá um texto de uma publicação do Facebook da marca {brand}.
                    Receberá também uma curta descrição sobre do que a marca se trata.

                    Se a publicação estiver tratando sobre um único produto específico da marca, retorne apenas o texto "product" para o campo post_type;
                    Senão, se a publicação estiver tratando sobre algum serviço prestado ou anunciado pela marca, como um evento ou promoção, retorne apenas o texto "service" para o campo post_type;
                    Senão, caso não trate de um produto nem de um serviço específico, seja apenas uma publicação de engajamento com o público ou outro, retorne apenas o texto "other" para o campo post_type.

                    Além disso, retorne para o campo "summary" um pequeno resumo do que a marca está anunciando ou divulgando com o texto da publicação.
                    Não ultrapasse 120 caracteres no resumo.
                '''
            ),
            (
                'user',
                '''
                    Texto da publicação: {post_content}
                    \n\n\n\n\n\n\n
                    Descrição sobre a marca {brand}: {brand_about}
                '''
            )
        ]
    )

    dict_schema = convert_to_openai_function(InfoAboutPost) # TODO: verificar
    structured_llm = llm.with_structured_output(dict_schema)
    chain = prompt | structured_llm

    resp = chain.invoke({
        'brand': brand.name,
        'brand_about': brand.about,
        'post_content': post.content,
    })

    resp_dict = resp[0]['args'] #TODO: verificar. Deveria retornar uma objeto da classe InfoAboutPost

    return InfoAboutPost(post_type = resp_dict['post_type'], summary = resp_dict['summary'])





def get_related_item_or_create(type: str, brand: Brand, post: Post) -> Item:
    items = item_service.getAllItemsAndPostByBrand(brand.id, type)

    items_text_list = []
    for item in items:
        text = f'###ITEM COM ID: {item.id}\n'
        posts_content = list(map(lambda item: item.content, item.posts))
        text += f'Lista de publicações: {posts_content}'
        items_text_list.append(text)
    
    items_text = '\n\n\n</item-separator>\n\n\n'.join(items_text_list)

    type_pt = 'produto' if type == 'product' else 'serviço'

    prompt = ChatPromptTemplate(
        [
            (
                'system',
                '''
                    Você é um assistente que receberá um texto de uma publicação do Facebook da marca {brand}.
                    Receberá também uma curta descrição sobre do que a marca se trata.

                    Você receberá também uma lista de itens, cada item contendo seu id (que vem no formato ###ITEM COM ID: "id") e uma lista de publicações.
                    Os items estão separados pela tag </item-separator>.

                    Você tentará identificar qual dos items trata EXATAMENTE do mesmo {item_type} do texto da publicação fornecido.
                    Retorne apenas o número do ID do item em questão.
                    
                    Caso não tenha muita certeza ou o texto da publicação não trate EXATAMENTE do mesmo {item_type} de nenhum dos itens, retorne None.
                '''
            ),
            (
                'user',
                '''
                    Descrição sobre a marca {brand}: {brand_about}
                    \n\n\n\n\n
                    Texto da publicação: {post_content}
                    \n\n\n\n\n
                    LISTA DOS ITENS:\n{items_posts}
                '''
            )
        ]
    )

    chain = prompt | llm

    resp = chain.invoke({
        'brand': brand.name,
        'brand_about': brand.about,
        'post_content': post.content,
        'item_type': type_pt,
        'items_posts': items_text,
    })

    print(resp.content)

    try:
        item_id = int(resp.content)
    except:
        item_id = None

    
    if item_id == None:
        print('CRIANDO NOVO ITEM') # TODO: remover
        # criar novo item
        # TODO: implementar função com IA para criar um nome e uma descrição para o novo item (com base no post_content)

        new_mock_item = Item(
            id=44,
            name='Novo item',
            description='Descrição do novo item',
            type=type,
            posts=[post]
        )

        new_item = item_service.create(new_mock_item)

        return new_item
    
    related_item = item_service.getById(item_id, type)
    print(f'ID do item relacionado: {item_id}')

    return related_item




class CommentAnalysis(BaseModel):
    ''' Classe contendo informações da análise de um comentário '''

    comment_id: int = Field(description='Id do comentário analisado. Valor inteiro')
    related_to: str = Field(description='Indica a quê o comentário se refere, "postItem" (ao item da publicação), "postBrand" (à marca) ou “beyondPost” (não relacionado com o conteúdo da publicação nem com a marca')
    score: float = Field(description='Valor entre 0 e 1 que corresponde à análise de sentimento do comentário.')

class PostAnalysis(BaseModel):
    ''' Classe contendo a lista com as análises dos comentários '''

    analysis: list[CommentAnalysis] = Field(description='A lista com itens na qual cada item é um objeto com informações da análise de um comentário.')

def get_comment_analysis(
        brand: Brand,
        post_content: str,
        comments_batch: list[Comment],
        related_item: Item | None
    ) -> list[CommentAnalysis]:

    prompt = ChatPromptTemplate(
        [
            (
                "system",
                '''
                    Você é um assistente responsável por fazer análise de sentimentos em comentários de publicações de marcas no Facebook.
                    Você receberá o texto de uma publicação e uma lista de comentários da publicação.
                    Receberá também informações sobre a marca da publicação (nome e descrição) e informações sobre o item a qual a publicação se refere (nome e descrição)

                    Analise detalhadamente cada comentário de maneira INDIVIDUAL e com base no texto da publicação.
                    Os comentários estão separados pela tag <comment-separator/>
                    Analise cada comentário e retorne 0 se for negativo, 0.5 se for neutro e 1 se for positivo para o campo "score".
                    Em caso de dúvida, retorne 0.5.

                    Para o campo "comment_id", retorne o id de cada comentário (valor inteiro).

                    Caso o comentário seja referente à publicação em si e ao item relacionado a ela, ou seu conteúdo seja um elogio ou uma crítica, para o campo "related_to" retorne "postItem";
                    Caso o comentário não trate da publicação nem do item em si, mas ainda se refira à marca, para o campo "related_to" retorne "postBrand";
                    Caso o comentário não tenha nenhuma referência com a publicação, com o item ou com a marca, para o campo "related_to" retorne "beyondPost"

                '''

                    #Além de retornar a lista com o resultado das análises, você irá retornar também a lista com os comentários que foram providos.
                    # Retorne uma lista de floats chamada "analysis" com o resultado das análises.
                # ou se o comentário não tiver nenhuma relação com o texto da publicação ou com a marca...
            ),
            ("user",
                '''
                    Texto da publicação: {post_content}

                    Marca da publicação: {brand}

                    Descrição da marca: {brand_about}

                    Nome do item a que a publicação se refere: {related_item_name}

                    Descrição item a que a publicação se refere: {related_item_desc}

                    
                    Lista de comentários: \n\n\n\n\n<comment-separator/> {comments} <comment-separator/>

                '''
                    #Tamanho da lista de análise a ser retornada: {anylisis_size}
            )
        ]
    )

    # output_parser = ...
    dict_schema = convert_to_openai_function(PostAnalysis) # TODO: verificar
    structured_llm = llm.with_structured_output(dict_schema)
    chain = prompt | structured_llm # | output_parser


    formatedComments = '\n\n\n\n<comment-separator/>\n\n\n\n'.join(
        [(f'COMENTÁRIO ID {c.id}: \n{c.text}') for c in comments_batch]
    )

    related_item_name = '<vazio>' if related_item == None else related_item.name
    related_item_desc = '<vazio>' if related_item == None else related_item.description

    resp = chain.invoke({
        'post_content': post_content,
        'comments': formatedComments,
        'brand': brand.name,
        'brand_about': brand.about,
        'related_item_name': related_item_name,
        'related_item_desc': related_item_desc
    })

    analysis: list[CommentAnalysis] = []

    if (len(resp) > 0):
        analysis = resp[0]['args']['analysis']


    if related_item == None:
        for i in range(len(analysis)):
            if analysis[i].related_to == 'postItem':
                analysis[i].related_to = 'postBrand'

    return analysis




def save_comment_analysis(analysis: list[CommentAnalysis]):
    for a in analysis:
        comment_analysis_service.create(a)







def run_analysis_for_brand_posts_since(brand: Brand, since: datetime=None): #TODO: verificar o tipo da data 'since'
    posts = post_service.getPostsByBrandSince(brand.id, since)

    for post in posts:
        print('\n')
        info = get_info_about_post(post, brand)
        print(info.summary)
        print(info.post_type)

        if info.summary and len(info.summary) > 0:
            # TODO: ajustar isso
            p = Post(post.id)
            p.summary = info.summary
            post_service.update(p)


        related_item = None
        if info.post_type in ['product', 'service']:
            related_item = get_related_item_or_create(info.post_type, brand, post)
            print(related_item)


        #TODO: implementar esperar de acordo com qtd de repetições, para não ultrapassar 15 requisições por minuto


        batch_size = 10
        analysis: list[CommentAnalysis] = []
        comm = post.comments

        for _ in range(ceil(len(comm)/batch_size)):
            batch = comm[:batch_size]
            comm = comm[batch_size:]
            values = get_comment_analysis(brand, post.content, batch, related_item)
            analysis.extend(values)
            print(f'Analisados: {len(values)}\n\n')

        print(analysis)

        save_comment_analysis(analysis)

        print('\n--------')
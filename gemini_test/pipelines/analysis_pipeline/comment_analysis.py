from langchain.prompts import ChatPromptTemplate
from llm import llm
from pydantic import BaseModel, Field
from entities.brand import Brand
from entities.item import Item
from entities.post_comment import Post, Comment
from datetime import datetime
from services.post_service import PostService
from services.item_service import ItemService
from services.comment_analysis_service import CommentAnalysisService
from prompt_config import PromptConfig, InfoAboutPost, CommentAnalysis, PostAnalysis
from math import ceil
from llm import Pipeline


def get_info_about_post(post: Post, brand: Brand) -> InfoAboutPost:
    if not post.content or len(post.content) == 0:
        return InfoAboutPost(post_type='other', summary='')

    resp = Pipeline.generic_pipeline(
        system_prompt=PromptConfig.GET_INFO_ABOUT_POST_SYSTEM,
        human_prompt=PromptConfig.GET_INFO_ABOUT_POST_HUMAN,
        input_data={
            'brand': brand.name,
            'brand_about': brand.about,
            'post_content': post.content,
        },
        structured_output=InfoAboutPost
    )

    return InfoAboutPost(post_type = resp['post_type'], summary = resp['summary'])



# TODO: atualizar essa função para usar busca vetorial
def get_related_item_or_create(type: str, brand: Brand, post: Post) -> Item:
    items = ItemService.getAllItemsAndPostByBrand(brand.id, type)

    items_text_list = []
    for item in items:
        text = f'###ITEM COM ID: {item.id}\n'
        posts_content = list(map(lambda item: item.content, item.posts))
        text += f'Lista de publicações: {posts_content}'
        items_text_list.append(text)
    
    items_text = '\n\n\n</item-separator>\n\n\n'.join(items_text_list)

    type_pt = 'produto' if type == 'product' else 'serviço'

    # TODO: o seguinte prompt não será necessário. A busca vetorial irá substituir a IA para encontrar o item relacionado.
    ## Teremos um prompt posterior à busca, que irá receber os itens mais relevantes (ex.: 3) e indicar qual o mais relevante deles.
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

        new_item = ItemService.create(new_mock_item)

        return new_item

    related_item = ItemService.getById(item_id, type)
    print(f'ID do item relacionado: {item_id}')

    return related_item



def get_comment_analysis(
        brand: Brand,
        post_content: str,
        comments_batch: list[Comment],
        related_item: Item | None
    ) -> list[CommentAnalysis]:

    formatedComments = f'\n\n\n\n{PromptConfig.COMMENT_SEPARATOR}\n\n\n\n'.join(
        [(f'COMENTÁRIO ID {c.id}: \n{c.text}') for c in comments_batch]
    )

    related_item_name = '<vazio>' if related_item == None else related_item.name
    related_item_desc = '<vazio>' if related_item == None else related_item.description

    resp = Pipeline.generic_pipeline(
        system_prompt=PromptConfig.GET_COMMENT_ANALYSIS_SYSTEM,
        human_prompt=PromptConfig.GET_COMMENT_ANALYSIS_HUMAN,
        input_data={
            'post_content': post_content,
            'comments': formatedComments,
            'brand': brand.name,
            'brand_about': brand.about,
            'related_item_name': related_item_name,
            'related_item_desc': related_item_desc
        },
        structured_output=PostAnalysis
    )

    analysis: list[CommentAnalysis] = []

    if resp:
        analysis = resp['analysis']


    if related_item == None:
        for i in range(len(analysis)):
            if analysis[i].related_to == 'postItem':
                analysis[i].related_to = 'postBrand'

    return analysis




def save_comment_analysis(analysis: list[CommentAnalysis]):
    for a in analysis:
        CommentAnalysisService.create(a)







def run_analysis_for_brand_posts_since(brand: Brand, since: datetime=None): #TODO: verificar o tipo da data 'since'
    posts = PostService.getPostsByBrandSince(brand.id, since)

    for post in posts:
        print('\n')
        info = get_info_about_post(post, brand)
        print(info.summary)
        print(info.post_type)

        if info.summary and len(info.summary) > 0:
            p = Post(post.id)
            p.summary = info.summary
            PostService.update(p)


        related_item = None
        if info.post_type in ['product', 'service']:
            related_item = get_related_item_or_create(info.post_type, brand, post)
            print(related_item)


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
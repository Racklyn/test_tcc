from entities.comment_analysis import CommentAnalysis
from entities.brand import Brand
from entities.item import Item
from entities.post_comment import Post, Comment
from services.post_service import PostService
from services.item_service import ItemService
from services.comment_analysis_service import CommentAnalysisService
from pipelines.comment_analysis.prompt_config import CommentAnalysisResponse, PromptConfig, InfoAboutPost, PostAnalysis, NewItemDefinition
from math import ceil
from llm import Pipeline
from datetime import datetime
from vector_db.vectordatabase import VectorDatabase
from pipelines.comment_analysis.prompt_config import ITEM_TAG_START, ITEM_TAG_END, ITEM_SEPARATOR, COMMENT_SEPARATOR
from utils.date_convertion import date_to_str_iso_format

MOST_RELEVANT_ITEMS = 5 #TODO: verificar esse valor, era 3

class CommentAnalysisPipeline:

    def get_info_about_post(post: Post, brand: Brand) -> InfoAboutPost:
        print(f'[DEBUG] Analisando informações do post ID: {post["id"]}')
        
        if not post['content'] or len(post['content']) == 0:
            print(f'[DEBUG] Post ID {post["id"]} sem conteúdo, retornando tipo "other"')
            return InfoAboutPost(post_type='other', summary='')

        print(f'[DEBUG] Chamando LLM para analisar post ID: {post['id']}')
        resp = Pipeline.generic_pipeline(
            system_prompt=PromptConfig.GET_INFO_ABOUT_POST_SYSTEM,
            human_prompt=PromptConfig.GET_INFO_ABOUT_POST_HUMAN,
            input_data={
                'brand': brand['name'],
                'brand_about': brand['about'],
                'post_content': post['content'],
            },
            structured_output=InfoAboutPost
        )

        print(f'[DEBUG] Post ID {post['id']} analisado - Tipo: {resp['post_type']}, Summary: {len(resp['summary'])} chars')
        return InfoAboutPost(post_type = resp['post_type'], summary = resp['summary'])



    def get_related_item_or_create(item_type: str, brand: Brand, post: Post) -> Item:
        print(f'[DEBUG] Buscando item relacionado para post ID: {post['id']}, tipo: {item_type}')
        
        items = ItemService.getAllItemsAndPostsByBrand(brand['id'], item_type)
        print(f'[DEBUG] Encontrados {len(items)} itens do tipo {item_type} para brand ID: {brand['id']}')
        
        item_id = None
        item_type_PT = 'produto' if item_type == 'product' else 'serviço'

        # TODO: dessa maneira, a cada chamada o banco de dados é atualizado. Seria melhor fazer isso anteriormente. Verificar!
        print(f'[DEBUG] Atualizando banco vetorial com {len(items)} itens')
        db = VectorDatabase()
        for item in items:
            db.add_item_and_posts(item, brand['id'])

        print(f'[DEBUG] Realizando busca por similaridade para post ID: {post['id']}')
        similarities = db.similarity_search_for_post(item_type, post, brand['id'])
        print(f'[DEBUG] Encontradas {len(similarities)} similaridades')


        if len(similarities) > 0:
            most_relevant = similarities[:MOST_RELEVANT_ITEMS]
            print(f'[DEBUG] Analisando {len(most_relevant)} itens mais relevantes')

            items_text_list = []
            for id, doc, meta, score in most_relevant:
                
                text = f'###ITEM COM ID: {id}\n'
                text += f'Informações: {doc}'
                items_text_list.append(text)
        
            items_text = f'\n\n\n{ITEM_SEPARATOR}\n\n\n'.join(items_text_list)

            print(f'[DEBUG] Chamando LLM para identificar item relacionado')
            resp = Pipeline.generic_pipeline(
                system_prompt=PromptConfig.GET_RELATED_ITEM_SYSTEM,
                human_prompt=PromptConfig.GET_RELATED_ITEM_HUMAN,
                input_data={
                    'brand': brand['name'],
                    'brand_about': brand['about'],
                    'item_type': item_type_PT,
                    'post_content': post['content'],
                    'items_posts': items_text,
                }
            )

            item_id_str = resp.split(ITEM_TAG_START)[1].split(ITEM_TAG_END)[0].strip()
            print(f'[DEBUG] Item ID identificado: {item_id_str}')

            try:
                item_id = int(item_id_str)
            except:
                item_id = None
                print(f'[DEBUG] Não foi possível converter item_id_str para int. Valor retornado: {item_id_str}')

        
        if item_id == None:
            print(f'[DEBUG] Nenhum item relacionado encontrado, criando novo item do tipo: {item_type}')

            resp = Pipeline.generic_pipeline(
                system_prompt=PromptConfig.DEFINE_NEW_ITEM_SYSTEM,
                human_prompt=PromptConfig.DEFINE_NEW_ITEM_HUMAN,
                input_data={
                    'brand': brand['name'],
                    'brand_about': brand['about'],
                    'item_type': item_type_PT,
                    'post_content': post['content'],
                },
                structured_output=NewItemDefinition
            )

            new_item = Item(
                name=resp['name'],
                description=resp['description'],
                type=item_type,
                posts=[post],
                brand_id=brand['id']
            )

            print(f'[DEBUG] Salvando novo item: {resp['name']}')
            new_item = ItemService.create(new_item)

            return new_item

        related_item = next(filter(lambda x: x['id'] == item_id, items), None)

        #TODO: verificar, aqui preciso atualizar o post com o item_id específico?
        # Isso, em nenhum local estou vinculando esse item ao post!

        print(f'[DEBUG] Atualizando post ID {post['id']} com item ID: {item_id}')
        postAtualizado = PostService.update(Post({
            'id': post['id'],
            'item_id': item_id
        }))
        

        print(f'[DEBUG] Post atualizado: {postAtualizado}') #TODO: remover esse print

        return related_item



    def get_comment_analysis(
            brand: Brand,
            post_content: str,
            comments_batch: list[Comment],
            related_item: Item | None
        ) -> list[CommentAnalysis]:
        
        print(f'[DEBUG] Analisando lote de {len(comments_batch)} comentários')


        formatedComments = f'\n\n\n\n{COMMENT_SEPARATOR}\n\n\n\n'.join(
            [(f'COMENTÁRIO {i}: \n{c['text']}') for i, c in enumerate(comments_batch)]
        )

        related_item_name = '<vazio>' if related_item == None else related_item['name']
        related_item_desc = '<vazio>' if related_item == None else related_item['description']

        print(f'[DEBUG] Chamando LLM para análise de sentimentos dos comentários')
        resp = Pipeline.generic_pipeline(
            system_prompt=PromptConfig.GET_COMMENT_ANALYSIS_SYSTEM,
            human_prompt=PromptConfig.GET_COMMENT_ANALYSIS_HUMAN,
            input_data={
                'post_content': post_content,
                'comments': formatedComments,
                'brand': brand['name'],
                'brand_about': brand['about'],
                'related_item_name': related_item_name,
                'related_item_desc': related_item_desc
            },
            structured_output=PostAnalysis
        )

        analysisResponse: list[CommentAnalysisResponse] = []
        
        if resp:
            analysisResponse = resp['analysis']
            print(f'[DEBUG] Análise retornou {len(analysisResponse)} resultados')

        # converte CommentAnalysisResponse para CommentAnalysis
        analysis = [
            CommentAnalysis(
                comment_key=comments_batch[i]['key'],
                score=analysisResponse[i]['score'],
                related_to=analysisResponse[i]['related_to'],
                analysis_date=date_to_str_iso_format(datetime.now())
            ) for i in range(len(analysisResponse))]


        if related_item == None:
            print(f'[DEBUG] Ajustando relacionamento para "postBrand" (sem item relacionado)')
            for i in range(len(analysis)):
                if analysis[i]['related_to'] == 'postItem':
                    analysis[i]['related_to'] = 'postBrand'

        return analysis




    def save_comment_analysis(analysis: list[CommentAnalysis], post_id: int):
        successCount = 0
        lastAnalysis = None
        for a in analysis:
            resp = CommentAnalysisService.create(a)
            if not resp == None:
                successCount += 1
                lastAnalysis = a
        
        print(f'[DEBUG] {successCount}/{len(analysis)} análises salvas com sucesso')
        if lastAnalysis != None:
            print(f'[DEBUG] Salvando data da última análise: {lastAnalysis['analysis_date']}')

            PostService.update(Post({
                'id': post_id,
                'last_analysis': lastAnalysis['analysis_date']
            }))







    def run_analysis_for_brand_posts_since(brand: Brand, date_since: str=None):
        print(f'[DEBUG] INICIANDO ANÁLISE para brand: {brand['name']} (ID: {brand['id']})')
        if date_since:
            print(f'[DEBUG] Filtrando posts desde: {date_since}')
        else:
            print(f'[DEBUG] Analisando todos os posts disponíveis')
        
        posts: list[Post] = PostService.getPostsByBrandSince(brand['id'], date_since)
        print(f'[DEBUG] Encontrados {len(posts)} posts para análise')

        for i, post in enumerate(posts, 1):
            print(f'\n[DEBUG] PROCESSANDO POST {i}/{len(posts)} - ID: {post['id']}')
            print(f"[DEBUG] Conteúdo do post: {post['content'][:15]}{'...' if len(post['content']) > 10 else ''}")
            
            info = CommentAnalysisPipeline.get_info_about_post(post, brand)
            print(f'[DEBUG] Informações do post: {info}')

            if info.summary and len(info.summary) > 0:
                print(f'[DEBUG] Atualizando post ID {post['id']} com novo summary')
                p = Post({
                    'id': post['id'],
                    'summary': info.summary
                })
                PostService.update(p)

            related_item = None
            if info.post_type in ['product', 'service']:
                print(f'[DEBUG] Buscando item relacionado para tipo: {info.post_type}')
                related_item = CommentAnalysisPipeline.get_related_item_or_create(info.post_type, brand, post)
                print(f'[DEBUG] Item relacionado: name={related_item['name']}, id={related_item['id']}')

            print(f'[DEBUG] Iniciando análise de comentários - Total: {len(post['comments'])}')
            batch_size = 10
            analysis: list[CommentAnalysis] = []
            comm = post['comments']

            for batch_num in range(ceil(len(comm)/batch_size)):
                print(f'[DEBUG] Processando lote {batch_num + 1}/{ceil(len(comm)/batch_size)}')
                batch = comm[:batch_size]
                comm = comm[batch_size:]
                values = CommentAnalysisPipeline.get_comment_analysis(brand, post['content'], batch, related_item)
                analysis.extend(values)
                print(f'[DEBUG] Lote {batch_num + 1} analisado: {len(values)} comentários')

            print(f'[DEBUG] Total de análises a serem salvas para este post: {len(analysis)}')


            CommentAnalysisPipeline.save_comment_analysis(analysis, post['id'])

            print(f'[DEBUG] POST {i}/{len(posts)} FINALIZADO')
            print('\n--------------------------------')
        
        print(f'[DEBUG] ANÁLISE COMPLETA! Processados {len(posts)} posts')

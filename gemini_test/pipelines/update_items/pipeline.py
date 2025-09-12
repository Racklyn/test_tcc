import datetime
from entities.item_analysis_result import ItemAnalysisResult
from entities.post_comment import Post
from llm import Pipeline
from entities.item import Item
from entities.brand import Brand
from pipelines.update_items.prompt_config import PromptConfig, SyncItemAnalysisResults, UpdatedItemInfos
from services.item_analysis_result_service import ItemAnalysisResultService
from services.item_service import ItemService
from services.post_service import PostService
from utils.date_convertion import date_to_str_iso_format


class UpdateItemsPipeline:

    def sync_item_infos(item: Item, brand: Brand) -> Item | None:
        print(f'[DEBUG] Sincronizando informações do item ID: {item['id']}')
        print(f'[DEBUG] Item desatualizado (outdated)? {item['outdated']}')

        if not item['outdated']:
            print(f'[DEBUG] Item ID: {item['id']} já está sincronizado com os posts relacionados. Pulando etapa...')
            return

        item_type_PT = 'produto' if item['type'] == 'product' else 'serviço'
        posts_content = '\n'.join([post['content'] for post in item['posts']])
        
        resp = Pipeline.generic_pipeline(
            system_prompt=PromptConfig.SYNC_ITEM_INFOS_SYSTEM,
            human_prompt=PromptConfig.SYNC_ITEM_INFOS_HUMAN,
            input_data={
                'brand_name': brand['name'],
                'brand_about': brand['about'],
                'item_name': item['name'],
                'item_type_PT': item_type_PT,
                'item_description': item['description'],
                'posts_content': posts_content,
            },
            structured_output=UpdatedItemInfos
        )

        updatedItem: Item = {
            'id': item['id'],
            'description': resp['description'],
            'last_sync': date_to_str_iso_format(datetime.datetime.now())
        }

        if not item['block_name_from_updates'] and resp['name'] != None:
            updatedItem['name'] = resp['name']

        updatedItem = ItemService.update(updatedItem)

        if updatedItem:
            print(f'[DEBUG] Item atualizado: {updatedItem}')
        else:
            print(f'[DEBUG] Erro ao atualizar item: {updatedItem}')
            raise Exception(f'Erro ao atualizar item: {updatedItem}')

        return updatedItem
        




    def sync_analysis_results(item: Item) -> ItemAnalysisResult:
        print(f'[DEBUG] Sincronizando resultados da análise de comentários do item ID: {item['id']}')

        if not item['outdated']:
            print(f'[DEBUG] Os resultados da análise do Item com ID {item['id']} já estão atualizados. Finalizando...')
            return

        positive = []
        neutral = []
        negative = []

        for post in item['posts']:
            print(f'[DEBUG] Pegando análises do post ID: {post['id']}')
            #TODO: verificar se seria importante ter o conteúdo do post (pode ficar muita informação).
            #posts_comment_analysis_str += f'###Texto do POST {i+1}: {post['content']}\n'

            postWithAnalysis: Post = PostService.getPostWithAnalysis(post_id=post['id'], related_to='postItem')

            for comment in postWithAnalysis['comments']:
                if comment['comment_analysis'][0]['score'] == 1:
                    positive.append(comment['text'])
                elif comment['comment_analysis'][0]['score'] == 0.5:
                    neutral.append(comment['text'])
                elif comment['comment_analysis'][0]['score'] == 0:
                    negative.append(comment['text'])

        print(f'[DEBUG] *** Análises positivas: {len(positive)}')
        print(f'[DEBUG] *** Análises neutras: {len(neutral)}')
        print(f'[DEBUG] *** Análises negativas: {len(negative)}')

        resp = Pipeline.generic_pipeline(
            system_prompt=PromptConfig.SYNC_ANALYSIS_RESULTS_SYSTEM,
            human_prompt=PromptConfig.SYNC_ANALYSIS_RESULTS_HUMAN,
            input_data={
                'item_name': item['name'],
                'item_description': item['description'],
                'positive_comments': positive,
                'neutral_comments': neutral,
                'negative_comments': negative,
            },
            structured_output=SyncItemAnalysisResults
        )

        result = ItemAnalysisResultService.create(ItemAnalysisResult({
            'analysis_summary': resp['summary'],
            'positive_points': resp['positivePoints'],
            'negative_points': resp['negativePoints'],
            'item_id': item['id']
        }))

        if result:
            print(f'[DEBUG] Resultado da análise de item salvo: {result}')
        else:
            print(f'[DEBUG] Erro ao salvar resultado da análise de item: {result}')
            raise Exception(f'Erro ao salvar resultado da análise de item: {result}')
        
        return result




    def update_item(item: Item, brand: Brand) -> tuple[bool, str]: #TODO: verificar se é necessário informar brand (já deveria pegar por item.brand_id)
        try:
            UpdateItemsPipeline.sync_item_infos(item, brand)
            UpdateItemsPipeline.sync_analysis_results(item)
            return (True, 'Item atualizado com sucesso')
        except Exception as e:
            print(f'[DEBUG] Erro ao atualizar item: {e}')
            return (False, f'Erro ao atualizar item: {e}')




    def update_all_items_from_brand(brand: Brand) -> tuple[bool, str]:
        items: list[Item] = ItemService.getAllItemsAndPostsByBrand(brand['id'])
        print(f'[DEBUG] Encontrados {len(items)} itens para brand ID: {brand['id']}')

        success_count = 0

        for item in items:
            success, _ = UpdateItemsPipeline.update_item(item, brand)
            if success:
                success_count += 1

        print(f'[DEBUG] {success_count}/{len(items)} itens atualizados com sucesso')
        return (success_count > 0, f'{success_count}/{len(items)} itens atualizados com sucesso')


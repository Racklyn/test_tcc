from utils.singleton import singleton
from chromadb.utils import embedding_functions
import chromadb
from entities.item import Item
from entities.post_comment import Post

COLLECTION_NAME = 'posts'
EMBD_FUNCTION = embedding_functions.DefaultEmbeddingFunction() #all-MiniLM-L6-v2
NOF_RESULTS = 5 # TODO: verificar esse valor
MAX_DISTANCE = 1.0 #TODO: Verificar esse valor (era 0.5, mas elimava muitos resultados relevantes)


@singleton
class VectorDatabase:
    def __init__(self):
        self.chroma_client = chromadb.Client()
        self.collection = self.chroma_client.get_or_create_collection(
            name=COLLECTION_NAME,
            embedding_function=EMBD_FUNCTION
        )

    def add_item_and_posts(self, item: Item, brand_id: int) -> bool:
        '''Adicionar um item com suas publicações ao banco vetorial'''

        type_pt = 'produto' if item['type'] == 'product' else 'serviço'
        
        document = f'''
            Nome do {type_pt}: {item['name']}
            Descrição: {item['description']}

            PUBLICAÇÕES SOBRE ESTE {type_pt}:

            {[post['content'] for post in item['posts']]}
        '''

        self.collection.add(
            ids=[str(item['id'])],
            documents=[document],
            metadatas=[{'name': item['name'], 'description': item['description'], 'type': item['type'], 'brand_id': brand_id}],
        )

        return True
    
    def similarity_search_for_post(self, item_type: str, post: Post, brand_id: int) -> list[tuple]:
        print(f"[DEBUG] VectorDB: Realizando busca por similaridade para post ID: {post['id']}")

        try:
            similarities = self.collection.query(
                query_texts=[post['content']],
                n_results=NOF_RESULTS,
                include=['distances', 'metadatas', 'documents'],
                where={'$and': [{'brand_id': brand_id}, {'type': item_type}]}
            )

            print(f"[DEBUG] VectorDB: Resultados encontrados: {similarities}")

            if not similarities['ids'] or len(similarities['ids'][0]) == 0:
                print(f"[DEBUG] VectorDB: Nenhum resultado encontrado")
                return []

            similarities = list(zip(
                similarities['ids'][0],
                similarities['documents'][0],
                similarities['metadatas'][0],
                similarities['distances'][0]
            ))

            similarities = [
                (id, doc, meta, score)
                for id, doc, meta, score in similarities if score <= MAX_DISTANCE
            ]
            
            return similarities

        except Exception as e:
            print(f"[DEBUG] VectorDB: Erro na busca por similaridade: {e}")
            return []


if __name__ == '__main__':
    db = VectorDatabase()

    # ...
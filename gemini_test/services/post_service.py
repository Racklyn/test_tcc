from datetime import datetime
from entities.post_comment import Post
from services.database_conection import DatabaseConnection
from services.endpoints import POST

db = DatabaseConnection()

class PostService:

    def getPostsByBrandSince(brand_id: int, date_since: str=None) -> list[Post]:
        try:
            posts = db.generic_getter(POST, {'brand_id': brand_id, 'since_date': date_since})
        except Exception as e:
            print(f'Erro ao buscar posts: {e}')
            return []
        
        return posts

    def getPostWithAnalysis(
        post_id: int,
        version: str=None,
        score: float=None,
        related_to: str=None
    ) -> Post:
        try:

            dto = {}
            if version: dto['version'] = version
            if score: dto['score'] = score
            if related_to: dto['related_to'] = related_to
            
            post = db.generic_getter(f'{POST}/{post_id}/withAnalysis', dto)
        except Exception as e:
            print(f'Erro ao buscar post com análise: {e}')
            return None
        
        return post

    def update(post: Post):
        try:
            post = db.generic_update(f'{POST}/{post['id']}', post)
        except Exception as e:
            print(f'Erro ao atualizar post: {e}')
            return None
        
        return post
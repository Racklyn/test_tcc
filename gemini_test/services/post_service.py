from datetime import datetime
from entities.post_comment import Post
from database_conection import DatabaseConnection
from endpoints import POST

db = DatabaseConnection()

class PostService:

    def getPostsByBrandSince(brand_id: int, since: datetime=None) -> list[Post]: #TODO: verificar o tipo da data 'since'
        posts = db.generic_getter(POST, {'brand_id': brand_id}) #TODO: adicionar since aqui
        return posts

    def update(post: Post):
        print(f'Atualizando post com id {post.id}')
        # TODO: implementar update
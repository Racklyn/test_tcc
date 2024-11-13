from datetime import datetime
from entities.post_comment import Post
from mocks.motorola_post import motorola_posts
from mocks.samsung_mock import samsung_posts

def getPostsByBrandSince(brand_id: int, since: datetime=None) -> list[Post]: #TODO: verificar o tipo da data 'since'
    return samsung_posts[3:4]#[-2:] # mock data

    # TODO: implementar comunicação com backend

def update(post: Post):
    print(f'Atualizando post com id {post.id}')
    # TODO: implementar update
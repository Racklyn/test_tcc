from typing import TypedDict
from entities.brand import Brand
from entities.post_comment import Post

class Page(TypedDict):
    id: int
    title: str
    page_description: str | None
    brand: Brand
    posts: list[Post]
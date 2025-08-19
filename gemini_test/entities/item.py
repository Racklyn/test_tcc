from entities.post_comment import Post
from typing import TypedDict

class Item(TypedDict):
    id: int
    name: str
    type: str
    description: str | None
    posts: list[Post]

    # TODO: finalizar essa classe conforme for necessário
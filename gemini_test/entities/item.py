from entities.post_comment import Post
from entities.brand import Brand
from typing import TypedDict

class Item(TypedDict):
    id: int
    name: str
    type: str
    description: str | None
    posts: list[Post]
    brand_id: int
    outdated: bool | None
    last_sync: str
    block_name_from_updates: bool | None
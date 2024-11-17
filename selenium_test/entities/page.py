from brand import Brand
from post_comment import Post

class Page:
    id: int
    title: str
    page_description: str | None
    brand: Brand
    posts: list[Post]
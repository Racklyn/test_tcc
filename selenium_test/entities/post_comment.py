from typing import TypedDict
from datetime import datetime
#from page import Page # TODO: verificar

class Comment(TypedDict):
    id: int
    text: str
    date: datetime # TODO: verificar tipo (str ou datetime?)

    # TODO: verificar; talvez não precise do construtor
    def __init__(self, id: int, text: str | None = None):
        self.id = id
        self.text = text

class Post(TypedDict):
    id: int
    content: str | None
    summary: str | None
    post_date: datetime # TODO: verificar tipo (str ou datetime?)
    updated_at: str| None
    comments: list[Comment]
    page: int # TODO: verificar tipo! (deveria ser Page?)

    # TODO: verificar; talvez não precise do construtor
    def __init__(self, id: int, content: str | None = None, comments: Comment=[]):
        self.id = id
        self.content = content
        self.comments = comments


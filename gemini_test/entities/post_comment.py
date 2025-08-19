from typing import TypedDict

class Comment(TypedDict):
    id: int
    text: str
    #date

class Post(TypedDict):
    id: int
    content: str | None
    summary: str | None
    #date: date
    updated_at: str| None
    comments: list[Comment]



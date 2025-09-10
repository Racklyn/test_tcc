from typing import TypedDict
from entities.comment_analysis import CommentAnalysis

class Comment(TypedDict):
    key: str
    text: str
    comment_analysis: list[CommentAnalysis]

class Post(TypedDict):
    id: int
    content: str | None
    summary: str | None
    updated_at: str| None
    comments: list[Comment]
    last_analysis: str | None
    item_id: int | None
from typing import TypedDict

class CommentAnalysis(TypedDict):
    id: int
    comment_id: int
    score: float
    related_to: str
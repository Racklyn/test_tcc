from typing import TypedDict

class CommentAnalysis(TypedDict):
    id: int
    score: float
    related_to: str
    analysis_date: str
    comment_key: str
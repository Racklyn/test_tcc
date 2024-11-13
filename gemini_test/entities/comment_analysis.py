class CommentAnalysis:
    id: int
    comment_id: int
    score: float
    related_to: str

    def __init__(self, id: int, comment_id: int, score: float, related_to: str):
        self.id = id
        self.comment_id = comment_id
        self.score = score
        self.related_to = related_to
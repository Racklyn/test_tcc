class Comment:
    id: int
    text: str
    #date

    def __init__(self, id: int, text: str | None = None):
        self.id = id
        self.text = text

class Post:
    id: int
    content: str | None
    summary: str | None
    #date: date
    updated_at: str| None
    comments: list[Comment]

    # TODO: verificar; talvez não precise do construtor
    def __init__(self, id: int, content: str | None = None, comments: Comment=[]):
        self.id = id
        self.content = content
        self.comments = comments


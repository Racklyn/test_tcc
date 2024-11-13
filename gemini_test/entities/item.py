from entities.post_comment import Post

class Item:
    id: int
    name: str
    type: str
    description: str | None
    posts: list[Post]

    # TODO: verificar; talvez não precise do construtor (apenas para teste)
    def __init__(self, id:int, name:str, type: str, description: str = None, posts: list[Post]=[]):
        self.id = id
        self.name = name
        self.type = type
        self.description = description
        self.posts = posts


    # TODO: finalizar essa classe conforme for necessário
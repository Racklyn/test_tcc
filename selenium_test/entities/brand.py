class Brand:
    id: int
    name: str
    about: str

    # TODO: verificar; talvez não precise do construtor (apenas para teste)
    def __init__(self, id:int, name:str, about:str):
        self.id = id
        self.name = name
        self.about = about


    # TODO: finalizar essa classe conforme for necessário
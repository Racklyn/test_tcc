from entities.brand import Brand

def getBrandById(id: int) -> Brand:
    b = Brand(1, 'Marca de teste', 'Marca vendedora de produtos')

    return b

    # TODO: implementar comunicação com backend
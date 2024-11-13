from datetime import datetime
from entities.item import Item
from mocks.samsung_mock import samsung_items

def getAllItemsAndPostByBrand(brand_id: int, type: str) -> list[Item]:
    return samsung_items # mock data

    # TODO: implementar comunicação com backend

def getById(item_id: int, type: str) -> Item | None:
    return list(filter(lambda item: item.id == item_id, samsung_items))[0]

    # TODO: implementar comunicação com backend

def create(item: Item) -> Item:
    # ...
    return item

    # TODO: implementar comunicação com backend
    
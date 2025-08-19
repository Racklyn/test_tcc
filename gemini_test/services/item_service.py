from datetime import datetime
from entities.item import Item
from database_conection import DatabaseConnection
from endpoints import ITEM

db = DatabaseConnection()

class ItemService:

    def getAllItemsAndPostByBrand(brand_id: int, type: str) -> list[Item]:
        items = db.generic_getter(ITEM, {'brand_id': brand_id, 'type': type})
        return items

    def getById(item_id: int) -> Item | None:
        item =  db.generic_getter(f'{ITEM}/{item_id}')
        return item

    def create(item: Item) -> Item:
        item = db.generic_insertion(ITEM, item.to_dict()) #TODO: verificar
        return item
        
from datetime import datetime
from entities.item import Item
from services.database_conection import DatabaseConnection
from services.endpoints import ITEM

db = DatabaseConnection()

class ItemService:

    def getAllItemsAndPostsByBrand(brand_id: int, item_type: str = None) -> list[Item]:
        try:
            items = db.generic_getter(f'{ITEM}/withPosts', {'brand_id': brand_id, 'type': item_type})
        except Exception as e:
            print(f'Erro ao buscar itens: {e}')
            return []
        
        return items

    def getById(item_id: int) -> Item | None:
        try:
            item =  db.generic_getter(f'{ITEM}/{item_id}')
        except Exception as e:
            print(f'Erro ao buscar item: {e}')
            return None
        
        return item

    def create(item: Item) -> Item:
        try:
            item = db.generic_insertion(ITEM, item)
        except Exception as e:
            print(f'Erro ao criar item: {e}')
            return None
        
        return item

    def update(item: Item) -> Item:
        try:
            item = db.generic_update(f'{ITEM}/{item['id']}', item)
        except Exception as e:
            print(f'Erro ao atualizar item: {e}')
            return None
        
        return item
        
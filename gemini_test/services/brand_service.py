from entities.brand import Brand
from services.database_conection import DatabaseConnection
from services.endpoints import BRAND

db = DatabaseConnection()

class BrandService:

    def getBrandById(id: int) -> Brand|None:
        try:
            brand = db.generic_getter(f'{BRAND}/{id}')
        except Exception as e:
            print(f'Erro ao buscar marca: {e}')
            return None

        return brand
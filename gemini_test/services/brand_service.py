from entities.brand import Brand
from services.database_conection import DatabaseConnection
from services.endpoints import BRAND

db = DatabaseConnection()

class BrandService:

    def getBrandById(id: int) -> Brand:
        brand = db.generic_getter(f'{BRAND}/{id}')

        return brand
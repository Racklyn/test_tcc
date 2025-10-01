from entities.brand import Brand
from entities.item import Item
from pipelines.comment_analysis.pipeline import CommentAnalysisPipeline
from services.brand_service import BrandService
from pipelines.update_items.pipeline import UpdateItemsPipeline
from services.item_service import ItemService

def run_analysis(brand_id: int, date_since_str: str=None) -> tuple[bool, str]:

    brand = BrandService.getBrandById(brand_id)

    print(brand)

    if not brand:
        print("Brand not found")
        return (False, 'Brand not found')
    
    CommentAnalysisPipeline.run_analysis_for_brand_posts_since(brand, date_since_str)
    return (True, 'Analysis run successfully')


def update_item(item_id: int) -> tuple[bool, str]:
    item: Item | None = ItemService.getById(item_id)
    print(f'item: {item}')

    brand = item['brand'] if item else None
    print(f'brand: {brand}')
    
    if not brand or not item:
        print("Brand or item not found")
        return (False, 'Item not found')

    return UpdateItemsPipeline.update_item(item, brand)

def update_all_items_from_brand(brand_id: int) -> tuple[bool, str]:
    brand = BrandService.getBrandById(brand_id)

    print(f'brand: {brand}')
    
    if not brand:
        print("Brand not found")
        return (False, 'Brand not found')
    
    success, message = UpdateItemsPipeline.update_all_items_from_brand(brand)
    return (success, message)



if __name__ == "__main__":
    #run_analysis(brand_id=2, date_since_str='2025-01-01')
    
    update_item(item_id=40)
    #update_all_items_from_brand(brand_id=2)
    
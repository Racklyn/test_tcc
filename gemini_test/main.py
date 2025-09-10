from pipelines.comment_analysis.pipeline import CommentAnalysisPipeline
from services.brand_service import BrandService
from pipelines.update_items.pipeline import UpdateItemsPipeline
from services.item_service import ItemService

def run_analysis(brand_id: int, date_since_str: str):

    brand = BrandService.getBrandById(brand_id)

    print(brand)

    if not brand:
        print("Brand not found")
    else:
        CommentAnalysisPipeline.run_analysis_for_brand_posts_since(brand, date_since_str)


def update_item(brand_id: int, item_id: int, update_all = False):
    brand = BrandService.getBrandById(brand_id)
    item = ItemService.getById(item_id)

    print(f'brand: {brand}')
    print(f'item: {item}')
    
    if brand and item:
        UpdateItemsPipeline.update_item(item, brand)
    elif brand and update_all:
        UpdateItemsPipeline.update_all_items_from_brand(brand)
    else:
        print("Brand or item not found")




if __name__ == "__main__":
    #run_analysis(brand_id=2, date_since_str='2025-01-01')
    
    update_item(brand_id=2, item_id=40) #, update_all=True
    
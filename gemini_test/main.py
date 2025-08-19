from pipelines.analysis_pipeline.comment_analysis import run_analysis_for_brand_posts_since
from services.brand_service import BrandService

def run():
    id = 2 # TODO: passar esse valor dinamicamente

    brand = BrandService.getBrandById(id)

    print(brand)

    if not brand:
        print("Brand not found")
        return

    run_analysis_for_brand_posts_since(brand)


if __name__ == "__main__":
    run()
from actions.comment_analysis import run_analysis_for_brand_posts_since
from entities.brand import Brand

def run():
    #b = Brand(1, 'Motorola', 'Marca de celulares/smartphones')
    b = Brand(2, 'Samsung', 'Marca de celulares/smartphones, TV, computadores e outros eletrônicos')

    run_analysis_for_brand_posts_since(b)


run()
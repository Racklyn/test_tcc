from typing import Literal
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from configs.api_configs import ApiConfigs
from main import run_analysis, update_item, update_all_items_from_brand

app = FastAPI(
    title="Analisador de Sentimentos API",
    description="API para análise de sentimentos de publicações de marcas",
    version="1.0.0",
    docs_url="/docs",  # URL para acessar o Swagger UI
    redoc_url="/redoc"  # URL para acessar o ReDoc
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DefaultResponse(BaseModel):
    message: str
    status: Literal['SUCCESS', 'ERROR']
    data: dict = {}
    

@app.post('/runAnalysis', response_model=DefaultResponse, 
          summary="Executar Análise de Comentários",
          description="Executa a análise de comentários para uma marca específica a partir de uma data determinada")
async def analysis_endpoint(
    brand_id: int = Query(..., description="ID da marca para análise", examples=[1]),
    date_since_str: str | None = Query(None, description="Data de início da análise (formato: YYYY-MM-DD)", examples=["2024-01-01"])
):
    """
    Executa a análise de comentários para uma marca específica.
    
    - **brand_id**: ID da marca para análise
    - **date_since_str**: Data de início da análise (formato: YYYY-MM-DD)
    
    Retorna uma mensagem indicando se a análise foi executada com sucesso.
    """
    success, message = run_analysis(brand_id, date_since_str)

    return DefaultResponse(
        message=message,
        status='SUCCESS' if success else 'ERROR'
    )



@app.post('/updateItem', response_model=DefaultResponse,
          summary="Atualizar Item Específico",
          description="Atualiza um item específico de uma marca")
async def update_endpoint(
    item_id: int = Query(..., description="ID do item a ser atualizado", examples=[123])
):
    """
    Atualiza um item específico de uma marca.
    
    - **item_id**: ID do item a ser atualizado
    
    Retorna uma mensagem indicando se o item foi atualizado com sucesso.
    """
    success, message = update_item(item_id)

    return DefaultResponse(
        message=message,
        status='SUCCESS' if success else 'ERROR'
    )



@app.post('/updateAllItemsFromBrand', response_model=DefaultResponse,
          summary="Atualizar Todos os Itens de uma Marca",
          description="Atualiza todos os itens de uma marca específica")
async def update_all_endpoint(
    brand_id: int = Query(..., description="ID da marca cujos itens serão atualizados", examples=[1])
):
    """
    Atualiza todos os itens de uma marca específica.
    
    - **brand_id**: ID da marca cujos itens serão atualizados
    
    Retorna uma mensagem indicando se todos os itens foram atualizados com sucesso.
    """
    success, message = update_all_items_from_brand(brand_id)

    return DefaultResponse(
        message=message,
        status='SUCCESS' if success else 'ERROR'
    )


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host=ApiConfigs.HOST, port=ApiConfigs.PORT)
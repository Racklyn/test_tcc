from typing import Literal, Optional
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from configs.api_configs import ApiConfigs
from main import get_all_pages_and_run

app = FastAPI(
    title="Extração de Publicações de Páginas de Facebook API",
    description="API para extração de publicações e comentários de páginas do Facebook de marcas",
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
    

@app.post('/extractFromAllPagesOfBrand', response_model=DefaultResponse, 
          summary="Extrair dados de todas as páginas de uma marca",
          description="Extrair dados dos posts mais recentes (com seus comentários) de todas as páginas de uma marca a partir de uma data determinada")
async def extract_from_all_pages_endpoint(
    brand_id: int = Query(..., description="ID da marca para extração", examples=[1], required=True),
    date_since_str: Optional[str] = Query(None, description="Data de início da extração (formato: YYYY-MM-DD)", examples=["2024-01-01"])
):
    """
    Extrair dados dos posts mais recentes (com seus comentários) de todas as páginas de uma marca a partir de uma data determinada.
    
    - **brand_id**: ID da marca para extração
    - **date_since_str**: Data de início da extração (formato: YYYY-MM-DD)
    
    Retorna uma mensagem indicando se a extração foi executada com sucesso.
    """
    success, message = get_all_pages_and_run(brand_id, date_since_str)

    return DefaultResponse(
        message=message,
        status='SUCCESS' if success else 'ERROR'
    )



if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host=ApiConfigs.HOST, port=ApiConfigs.PORT)
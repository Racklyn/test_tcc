import os

def get_base_url():
    """
    Detecta se está rodando no Docker ou localmente e retorna a URL apropriada.
    - Docker: usa WEB_SERVICE_URL (padrão: http://web-service:3000)
    - Local: usa WEB_SERVICE_URL_LOCAL (padrão: http://localhost:3000)
    """
    # Verifica se está rodando no Docker (presença de variáveis específicas do Docker)
    is_docker = os.path.exists('/.dockerenv') or os.getenv('DOCKER_CONTAINER') == 'true'
    
    if is_docker:
        return os.getenv('WEB_SERVICE_URL', 'http://web-service:3000')
    else:
        return os.getenv('WEB_SERVICE_URL_LOCAL', 'http://localhost:3000')

BASE_URL = get_base_url()

BRAND = 'brand'
PAGE = 'page'
POST = 'post'
COMMENT_ANALYSIS = 'commentAnalysis'
ITEM = 'item'
ITEM_ANALYSIS_RESULT = 'itemAnalysisResult'
import os
import socket

# Carregar variáveis de ambiente do arquivo .env no diretório pai
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env'))

def get_webservice_url():
    """
    Detecta automaticamente se está rodando em Docker ou localmente
    e retorna a URL apropriada para o webservice
    """
    # Verificar se está rodando em Docker (verificando se existe /.dockerenv)
    is_docker = os.path.exists('/.dockerenv')
    
    if is_docker:
        # Em Docker, usar o nome do serviço
        return os.getenv('WEB_SERVICE_URL', 'http://webservice:3000')
    else:
        # Localmente, usar localhost
        return os.getenv('WEB_SERVICE_URL_LOCAL', 'http://localhost:3000')

BASE_URL = get_webservice_url()

PAGE = 'page'
POST = 'post'
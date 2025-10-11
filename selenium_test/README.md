# Scraper - Selenium Web Scraping

Módulo responsável pela extração automatizada de publicações e comentários de páginas do Facebook, utilizando Selenium para web scraping e automação de navegador.

## 🎯 Sobre o Módulo

O **Scraper** é um serviço Python que utiliza Selenium WebDriver para:

- **Extrair publicações** de páginas do Facebook de marcas cadastradas
- **Coletar comentários** associados a cada publicação
- **Navegar automaticamente** pelas páginas do Facebook
- **Armazenar dados** extraídos no banco de dados PostgreSQL
- **Processar datas** e metadados das publicações

## 💻 Tecnologias

- **Python 3.12**
- **Selenium** - Automação de navegador web
- **FastAPI** - Framework web para APIs
- **Chrome WebDriver** - Driver para automação do Chrome
- **Pandas** - Manipulação de dados
- **PostgreSQL** - Banco de dados principal

## 🔧 Executando o Módulo

### Com Docker (Recomendado)

```bash
# Apenas o banco de dados
docker compose up -d database

# Apenas o serviço de scraping
docker compose up -d scraper
```

### Localmente

#### Pré-requisitos
- Python 3.12
- Google Chrome instalado
- ChromeDriver (gerenciado automaticamente pelo webdriver-manager)

#### Configuração

1. **Navegue para o diretório:**
```shell
cd selenium_test/
```

2. **Crie e ative o ambiente virtual:**
```shell
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# ou
.venv\Scripts\activate     # Windows
```

3. **Instale as dependências:**
```shell
pip install -r requirements.txt
```

#### Execução

**Iniciar a API:**
```shell
python api.py
```

**Execução direta do script:**
```shell
# Configure o brand_id e data na função get_all_pages_and_run() no final do arquivo
python main.py
```

## 📄 Documentação da API

- **Swagger UI**: http://localhost:5000/docs
- **ReDoc**: http://localhost:5000/redoc

## ⚙️ Configurações

### Variáveis de Ambiente

- `DB_HOST`: Host do banco de dados (padrão: database)
- `DB_PORT`: Porta do banco de dados (padrão: 5432)
- `DB_USERNAME`: Usuário do banco (padrão: postgres)
- `DB_PASSWORD`: Senha do banco (padrão: postgres)
- `DB_NAME`: Nome do banco (padrão: facebook_brand_analyzer)
- `WEB_SERVICE_URL`: URL do webservice (padrão: http://webservice:3000)

### Porta de Execução
- **Desenvolvimento**: 5000
- **Docker**: 5000

## 📝 Notas Importantes

- O módulo utiliza Chrome WebDriver para automação
- É necessário ter Google Chrome instalado para execução local
- O ChromeDriver é baixado automaticamente pelo webdriver-manager
- O scraping pode demorar alguns minutos dependendo do volume de dados
- Os dados extraídos são salvos no banco de dados PostgreSQL
- O módulo depende de marcas e páginas cadastradas no sistema

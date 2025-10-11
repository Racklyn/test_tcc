# Analisador de marcas e produtos no Facebook

MVP de um sistema de análise de sentimentos e monitoramento de marcas no Facebook, desenvolvido para fornecer insights valiosos sobre a percepção do público em relação a produtos e serviços.

## 💬 Sobre o Sistema

O **Analisador de marcas e produtos no Facebook** é uma solução integrada que combina web scraping inteligente, análise de sentimentos com IA e visualização de dados para transformar o feedback do público em informações estratégicas acionáveis. A versão atual é um MVP, com funcionalidades limitadas e diversas melhorias a serem implementadas.

### Funcionalidades Principais

- **Gestão de Marcas**: Cadastro e gerenciamento completo de marcas com suas páginas do Facebook
- **Web Scraping Inteligente**: Extração automatizada de publicações e comentários usando Selenium
- **Análise de Sentimentos com IA**: Identificação automática de produtos/serviços e análise de sentimentos dos comentários das publicações usando Gemini API
- **Dashboard Interativo**: Interface moderna e responsiva com Vue.js e Vuetify
- **Estatísticas Detalhadas**: Métricas abrangentes sobre a percepção do público
- **Atualização Incremental**: Sistema modular que permite atualizações contínuas dos dados
- **Interface Intuitiva**: Experiência de usuário otimizada para análise e tomada de decisões

### Objetivo

Avaliar o nível de satisfação do público em relação a novos produtos lançados, promoções ou campanhas promovidas pelas empresas, permitindo que sejam tomadas decisões estratégicas baseadas em dados reais de engajamento e sentimentos dos consumidores.

## 💻 Tecnologias

### Frontend
- Vue.js 3
- Vuetify (biblioteca de componentes)
- Vite (build tool)
- Vue Router

### Backend (webservice + BD)
- NestJS
- PostgreSQL (Docker)

### Sentiment Analyzer
- Python
- Langchain
- Gemini API
- FastAPI

### Scraper
- Python
- Selenium
- FastAPI



## 🔧 Executando o projeto

### Execução Completa (Recomendada)

A forma mais simples de executar todo o projeto é através do Docker Compose, que irá subir todos os serviços necessários:

#### Pré-requisitos
- Docker
- Docker Compose

#### Configuração Inicial
```bash
# 1. Copiar configurações
cp env.example .env

# 2. Editar o arquivo .env com suas configurações
nano .env

# 3. Tornar script executável (OPCIONAL)
chmod +x docker-scripts.sh
```

#### Comandos Principais
```bash
# Iniciar todos os serviços
docker compose up -d
# ou
./docker-scripts.sh start

# Ver logs em tempo real
./docker-scripts.sh logs

# Parar todos os serviços
./docker-scripts.sh stop

# Status dos serviços
./docker-scripts.sh status
```

#### Portas de Acesso
- **Frontend (Vue.js)**: http://localhost:5173
- **Web Service (NestJS)**: http://localhost:3000
- **Sentiment Analyzer (Gemini)**: http://localhost:8000
- **Scraper (Selenium)**: http://localhost:5000
- **Database (PostgreSQL)**: localhost:5432

#### Banco de Dados
- **Host**: `database` (interno) ou `localhost` (externo)
- **Porta**: `5432`
- **Usuário**: `postgres`
- **Senha**: `postgres`
- **Banco**: `facebook_brand_analyzer`

**Comando de acesso:**
```bash
docker compose exec database psql -U postgres -d facebook_brand_analyzer
```

### Executando Módulos Individualmente

#### FRONTEND

**Com Docker:**
```bash
# Apenas o frontend
docker compose up -d frontend
```

**Localmente:**
Para rodar localmente, é necessário ter instalado [Node.js/npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

```shell
cd frontend/

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O frontend será executado na porta **5173**. Acesse a aplicação em [http://localhost:5173](http://localhost:5173).

#### WEBSERVICE (Backend)

**Com Docker:**
```bash
# Apenas o banco de dados
docker compose up -d database

# Apenas o serviço web
docker compose up -d webservice
```

**Localmente:**
Para rodar localmente, é necessário ter instalado [Docker](https://docs.docker.com/engine/install/) (para rodar o Postgres) e [Node.js/npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

```shell
cd webservice_test/

# Inicie uma instância do Postgres
docker compose up -d

# Instale as dependências
npm i

# Inicie o backend
npm run start:dev
```

O backend será executado na porta **3000**. Acesse o Swagger em [http://localhost:3000/docs](http://localhost:3000/docs).

#### SCRAPER

**Com Docker:**
```bash
# Apenas o banco de dados
docker compose up -d database

# Apenas o serviço de scraping
docker compose up -d scraper
```

**Localmente:**
Para rodar localmente, é necessário ter instalado [Python 3](https://www.python.org/downloads/).

```shell
cd selenium_test/

# Crie e ative o ambiente virtual
python -m venv .venv
source .venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Inicie a API do scraper
python api.py
```

Acesse o Swagger do scraper em [http://localhost:5000/docs](http://localhost:5000/docs).

**Execução direta do script:**
```shell
# Configure o brand_id e data na função get_all_pages_and_run() no final do arquivo
python main.py
```

#### ANALISADOR DE SENTIMENTOS

**Com Docker:**
```bash
# Apenas o banco de dados
docker compose up -d database

# Apenas o serviço de IA
docker compose up -d sentiment-analyzer
```

**Localmente:**
Para rodar localmente, é necessário ter instalado [Python 3](https://www.python.org/downloads/).

```shell
cd gemini_test/

# Crie e ative o ambiente virtual
python -m venv .venv
source .venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Configure a chave da API do Gemini no arquivo .env
# GEMINI_API_KEY=sua_chave_aqui

# Inicie a API do analisador
python api.py
```

Acesse o Swagger do analisador em [http://localhost:8000/docs](http://localhost:8000/docs).

**Execução direta do script:**
```shell
# Configure as opções desejadas na seção "if __name__ == '__main__':" no final do arquivo
python main.py
```

## 📄 Documentação

### Pasta com diagramas e melhorias futuras
- [Diagramas e melhorias (Google Drive)](https://drive.google.com/drive/folders/1acwxV1NQiazBCRvSl1jhTlvmxF4tiGvR?usp=drive_link)


### Frontend
- **Aplicação**: http://localhost:5173

### Webservice (Backend)
- **Swagger**: http://localhost:3000/docs
- **Redoc**: http://localhost:3000/redoc

### Scraper
- **Swagger**: http://localhost:5000/docs
- **Redoc**: http://localhost:5000/redoc

### Analisador de Sentimentos
- **Swagger**: http://localhost:8000/docs
- **Redoc**: http://localhost:8000/redoc
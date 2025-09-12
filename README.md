# Analisador de marcas e produtos no Facebook

MVP de uma plataforma que permite analisar a repercussão e a reação das pessoas às publicações de marcas no Facebook.
O objetivo do sistema é avaliar o nível de satisfação do público em relação a novos produtos lançados, promoções ou ideias promovidas pelas empresas.
Isso permitirá que empresas tomem decisões estratégicas com base no resultado dessas análises.

O projeto ainda está em desenvolvimento.

## 💻 Tecnologias

### Backend (webservice + BD)
- NestJS
- PostgreSQL

### Sentiment Analyzer
- Python
- Langchain
- Gemini API
- FastAPI

### Scraper
- Python
- Selenium
- FastAPI



## 🔧 Executando o projeto com Docker

### Pré-requisitos
- Docker
- Docker Compose

### Configuração Inicial
```bash
# 1. Copiar configurações
cp env.example .env

# 2. Editar o arquivo .env com suas configurações
nano .env

# 3. Tornar script executável (OPCIONAL)
chmod +x docker-scripts.sh
```

### Comandos Principais
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

### Portas de Acesso Padrão
- **Web Service (NestJS)**: 3000
- **Sentiment Analyzer (Gemini)**: 8000
- **Scraper (Selenium)**: 5000
- **Database (PostgreSQL)**: 5432

### Executando serviços individualmente
```bash
# Apenas o banco de dados
docker compose up -d database

# Apenas o serviço de IA
docker compose up -d sentiment-analyzer

# Apenas o serviço de scraping
docker compose up -d scraper

# Apenas o serviço web
docker compose up -d webservice
```

### Banco de Dados
- **Host**: `database` (interno) ou `localhost` (externo)
- **Porta**: `5432`
- **Usuário**: `postgres`
- **Senha**: `postgres`
- **Banco**: `facebook_brand_analyzer`
- **Rede**: `brand-analyzer-network`

**Comando de acesso:**
```bash
docker compose exec database psql -U postgres -d facebook_brand_analyzer
```

## 🔧 Executando o projeto localmente

### Webservice
Para rodar o banco de dados e o backend, é necessário ter instalado em sua máquina [Docker](https://docs.docker.com/engine/install/) e [Node.js/npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
Navegue para o diretório do webservice:

```shell
cd webservice_test/
```
Inicie uma instância do Postgres e crie o banco de dados do sistema executando o seguinte:
```shell
docker compose up -d
```
Instale as dependências do backend:
```shell
npm i
```
Por fim, inicie o backend com o comando abaixo:
```shell
npm run start:dev
```
O backend será executado, por padrão, na porta **3000**. Para visualizar e interagir com as rotas, é possível acessar o Swagger do projeto em [http://localhost:3000/api](http://localhost:3000/api).

### Scraper
Para rodar o módulo de scraper, é necessário ter instalado em sua máquina [Python 3](https://www.python.org/downloads/).
Navegue para o diretório do scraper:
```shell
cd selenium_test/
```
Crie e ative o ambiente virtual do python com os seguintes comandos:
```shell
python -m venv .venv      # cria um ambiente virtual para a aplicação
source .venv/bin/activate      # ativa o ambiente virtual criado
```
Instale as dependências do projeto:
```shell
pip install -r requirements.txt
```
Por fim, inicie a API do scraper o código com o seguinte:
```shell
python api.py
```

Você pode acessar o swagger do scraper em [http://localhost:5000/docs](http://localhost:5000/docs) e e executar as rotas existentes.


Além disso, é possível executar o scraper com o script "main.py", informando o id da marca que se deseja extrair os dados (brand_id) e a data a partir de quando deve ocorrer a extração, configurando isso na função "get_all_pages_and_run()" ao final do arquivo e, posteriormente, executando com o comando:

```shell
python main.py
```

### Analisador de sentimentos
Para rodar o módulo de análise de sentimentos, é necessário ter instalado em sua máquina [Python 3](https://www.python.org/downloads/).
Navegue para o diretório do analisador:
```shell
cd gemini_test/
```
Crie e ative o ambiente virtual do python com os seguintes comandos:
```shell
python -m venv .venv      # cria um ambiente virtual para a aplicação
source .venv/bin/activate      # ativa o ambiente virtual criado
```
Instale as dependências do projeto:
```shell
pip install -r requirements.txt
```
Configure a variável de ambiente `GEMINI_API_KEY` no arquivo ".env" com a chave da API do Gemini.

Por fim, inicie a API do analisador de sentimentos com o seguinte:
```shell
python api.py
```
Você pode acessar o swagger do analisador de sentimentos em [http://localhost:8000/docs](http://localhost:8000/docs) e e executar as rotas existentes.

Além disso, é possível executar o analisador de sentimentos com o script "main.py", fazendo as configurações desejadas na seção contendo "if __name__ == '__main__':" ao final do arquivo e, por fim, executando com o comando:

```shell
python main.py
```

## 📄 Documentação

### Webservice

- Swagger: http://localhost:3000/api
- Redoc: http://localhost:3000/redoc

### Scraper

- Swagger: http://localhost:5000/docs
- Redoc: http://localhost:5000/redoc

### Analisador de sentimentos

- Swagger: http://localhost:8000/docs
- Redoc: http://localhost:8000/redoc

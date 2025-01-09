# Analisador de marcas e produtos no Facebook

Versão em fase de teste de uma plataforma que permite analisar a repercussão e a reação das pessoas às publicações de marcas no Facebook.
O objetivo do sistema é avaliar o nível de satisfação do público em relação a novos produtos lançados, promoções ou ideias promovidas pelas empresas.
Isso permitirá que empresas tomem decisões estratégicas com base no resultado dessas análises.

O projeto ainda está em desenvolvimento.

## Executando o projeto localmente

### Webservice
Para rodar o banco de dados e o backend, é necessário ter instalado em sua máquina [Docker](https://docs.docker.com/engine/install/) e [Node.js/npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
Navegue para o diretório do webservice:

```shell
cd webservice_test/
```
Inicie uma instância do Postgres e crie o banco de dados do sistema executando o seguinte:
```shell
docker-compose up -d
```
Inicie o backend com o comando abaixo:
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
Por fim, execute o código com o seguinte:
```shell
python main.py
```
Nessa versão inicial, para configurar em qual página será feita a extração dos dados, você pode a chamada da função **run** no arquivo "main.py", passando o nome da página que deseja. O arquivo já inclui algumas sugestões de páginas para extração de dados.

Ao final da execução, os dados extraídos serão inseridos em um arquivo chamado “posts.txt” na raiz do projeto.

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
Por fim, execute o código com o seguinte:
```shell
python main.py
```
Por enquanto, os dados das publicações utilizados ainda estão mockados (não existe comunicação com o backend para pegar as publicações existentes). Em breve, o sistema será capaz de pegar corretamente os dados do backend. Para fins de testes, você pode pode criar seus próprios dados mockados (conforme os exemplos do disretório "mocks") e configurar os services (da pasta "services") para fazerem uso desse dados.


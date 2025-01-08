# Analisador de marcas e produtos no Facebook

Versão em fase de teste de uma plataforma que permite analisar a repercussão e a reação das pessoas às publicações de marcas no Facebook.
O objetivo do sistema é avaliar o nível de satisfação do público em relação a novos produtos lançados, promoções ou ideias promovidas pelas empresas.
Isso permitirá que empresas tomem decisões estratégicas com base no resultado dessas análises. <br>
O projeto ainda está em desenvolvimento.

## Executando o projeto localmente

### Webservice
Para rodar o banco de dados e o backend, é necessário ter isntalado em sua máquina [Docker](https://docs.docker.com/engine/install/) e [Node.js/npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
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
...

### Analisador de sentimentos
...

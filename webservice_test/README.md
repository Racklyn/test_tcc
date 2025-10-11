# Webservice - NestJS Backend

Módulo responsável pelo backend da aplicação, fornecendo APIs REST para gerenciamento de marcas, publicações, comentários e análises de sentimentos, utilizando NestJS como framework principal.

## 🎯 Sobre o Módulo

O **Webservice** é o backend central da aplicação, responsável por gerenciar todo o fluxo de dados do sistema de análise de marcas no Facebook. Utiliza NestJS para fornecer APIs REST robustas e escaláveis.

### Arquitetura de Dados

O sistema gerencia as seguintes entidades principais:

- **👤 User**: Usuários do sistema (autenticação será implementada futuramente)
- **🏢 Brand**: Marcas de interesse para monitoramento
- **📄 Page**: Páginas do Facebook associadas às marcas
- **📝 Post**: Publicações extraídas das páginas do Facebook
- **💬 Comment**: Comentários das publicações
- **🔍 CommentAnalysis**: Análises de sentimentos dos comentários
- **📦 Item**: Produtos ou serviços que foram identificados nas publicações pela IA
- **📊 ItemAnalysisResult**: Resultados consolidados das análises por item

### Funcionalidades Principais

- **Gestão de Marcas**: Cadastro e gerenciamento de marcas com suas páginas do Facebook
- **Armazenamento de Dados**: Persistência de publicações e comentários extraídos pelo scraper
- **Processamento de Análises**: Armazenamento e consulta de resultados de análise de sentimentos
- **APIs REST**: Endpoints para frontend e integração com outros módulos
- **Gerenciamento de Banco**: Operações CRUD com PostgreSQL via TypeORM
- **Documentação Automática**: APIs documentadas com Swagger/OpenAPI

## 💻 Tecnologias

- **Node.js**
- **NestJS** - Framework Node.js para aplicações server-side
- **TypeScript** - Linguagem de programação
- **TypeORM** - ORM para banco de dados
- **PostgreSQL** - Banco de dados principal
- **Swagger/OpenAPI** - Documentação de APIs
- **Class Validator** - Validação de dados

## 🔧 Executando o Módulo

### Com Docker (Recomendado)

```bash
# Apenas o banco de dados
docker compose up -d database

# Apenas o serviço web
docker compose up -d webservice
```

### Localmente

#### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn
- Docker (para executar o PostgreSQL)

#### Configuração

1. **Navegue para o diretório:**
```shell
cd webservice_test/
```

2. **Inicie uma instância do PostgreSQL:**
```shell
docker compose up -d
```

3. **Instale as dependências:**
```shell
npm install
```

#### Execução

**Iniciar o backend:**
```shell
npm run start:dev
```

**Outros comandos disponíveis:**
```shell
# Modo de produção
npm run start:prod

# Modo de debug
npm run start:debug

# Build da aplicação
npm run build
```

O backend será executado na porta **3000**. Acesse o Swagger em [http://localhost:3000/docs](http://localhost:3000/docs).

## 📄 Documentação da API

- **Swagger UI**: http://localhost:3000/docs
- **ReDoc**: http://localhost:3000/redoc

## ⚙️ Configurações

### Variáveis de Ambiente

- `DB_HOST`: Host do banco de dados (padrão: database)
- `DB_PORT`: Porta do banco de dados (padrão: 5432)
- `DB_USERNAME`: Usuário do banco (padrão: postgres)
- `DB_PASSWORD`: Senha do banco (padrão: postgres)
- `DB_NAME`: Nome do banco (padrão: facebook_brand_analyzer)
- `PORT`: Porta do servidor (padrão: 3000)
- `WEBSERVICE_SWAGGER`: Habilitar Swagger (padrão: true)

### Porta de Execução
- **Desenvolvimento**: 3000
- **Docker**: 3000

## 📝 Notas Importantes

- O módulo utiliza TypeORM para gerenciamento do banco de dados
- As entidades são sincronizadas automaticamente em desenvolvimento
- O Swagger é habilitado por padrão para documentação das APIs
- CORS está configurado para permitir acesso do frontend
- Validação de dados é aplicada globalmente com class-validator
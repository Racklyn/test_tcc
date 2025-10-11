# Analisador de Sentimentos - Gemini API

Módulo responsável pela análise de sentimentos de comentários em publicações do Facebook, utilizando inteligência artificial (Gemini API) para identificar produtos/serviços e analisar o sentimento dos comentários.

## 🎯 Sobre o Módulo

O **Analisador de Sentimentos** é um serviço Python que utiliza a API do Google Gemini para:

- **Identificar produtos/serviços** mencionados em publicações do Facebook
- **Analisar sentimentos** dos comentários relacionados a cada produto/serviço
- **Atualizar informações** de itens com base em novas publicações
- **Sintetizar resultados** destacando pontos positivos e negativos

## 💻 Tecnologias

- **Python 3.12**
- **FastAPI** - Framework web para APIs
- **Google Gemini API** - IA para análise de sentimentos
- **LangChain** - Framework para aplicações com LLM
- **Pandas** - Manipulação de dados
- **ChromaDB** - Banco de dados vetorial
- **PostgreSQL** - Banco de dados principal

## 🔧 Executando o Módulo

### Com Docker (Recomendado)

```bash
# Apenas o banco de dados
docker compose up -d database

# Apenas o serviço de análise de sentimentos
docker compose up -d sentiment-analyzer
```

### Localmente

#### Pré-requisitos
- Python 3.12
- Chave da API do Gemini

#### Configuração

1. **Navegue para o diretório:**
```shell
cd gemini_test/
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

4. **Configure as variáveis de ambiente:**
```shell
# Copie o arquivo de exemplo
cp env.example .env

# Edite o arquivo .env e adicione sua chave da API
nano .env
```

5. **Configure a chave da API do Gemini:**
```env
GEMINI_API_KEY=sua_chave_aqui
```

#### Execução

**Iniciar a API:**
```shell
python api.py
```

**Execução direta do script:**
```shell
# Configure as opções desejadas na seção "if __name__ == '__main__':" no final do arquivo
python main.py
```

## 📄 Documentação da API

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## ⚙️ Configurações

### Variáveis de Ambiente

- `GEMINI_API_KEY`: Chave da API do Google Gemini (obrigatória)
- `DB_HOST`: Host do banco de dados (padrão: database)
- `DB_PORT`: Porta do banco de dados (padrão: 5432)
- `DB_USERNAME`: Usuário do banco (padrão: postgres)
- `DB_PASSWORD`: Senha do banco (padrão: postgres)
- `DB_NAME`: Nome do banco (padrão: facebook_brand_analyzer)
- `WEB_SERVICE_URL`: URL do webservice (padrão: http://webservice:3000)

### Porta de Execução
- **Desenvolvimento**: 8000
- **Docker**: 8000

## 📝 Notas Importantes

- É necessário ter uma chave válida da API do Gemini
- O módulo depende de dados extraídos pelo scraper
- As análises podem demorar alguns minutos dependendo do volume de dados
- Resultados são armazenados no banco de dados PostgreSQL

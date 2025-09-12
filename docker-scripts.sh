#!/bin/bash

# Script de conveniência para gerenciar os serviços Docker do TCC

case "$1" in
    "start"|"dev")
        echo "Iniciando todos os serviços..."
        docker-compose up -d
        ;;
    "stop")
        echo "Parando todos os serviços..."
        docker-compose down
        ;;
    "restart")
        echo "Reiniciando todos os serviços..."
        docker-compose down
        docker-compose up -d
        ;;
    "build")
        echo "Reconstruindo e iniciando todos os serviços..."
        docker-compose up --build -d
        ;;
    "logs")
        echo "Mostrando logs de todos os serviços..."
        docker-compose logs -f
        ;;
    "logs-ai")
        echo "Mostrando logs do serviço de IA..."
        docker-compose logs -f sentiment-analyzer
        ;;
    "logs-scraper")
        echo "Mostrando logs do serviço de scraping..."
        docker-compose logs -f scraper
        ;;
    "logs-web")
        echo "Mostrando logs do serviço web..."
        docker-compose logs -f webservice
        ;;
    "logs-db")
        echo "Mostrando logs do banco de dados..."
        docker-compose logs -f database
        ;;
    "status")
        echo "Status dos serviços:"
        docker-compose ps
        ;;
    "clean")
        echo "Limpando containers, volumes e imagens..."
        docker-compose down -v
        docker system prune -f
        ;;
    "ai-only")
        echo "Iniciando apenas o serviço de IA..."
        docker-compose up -d database sentiment-analyzer
        ;;
    "scraper-only")
        echo "Iniciando apenas o serviço de scraping..."
        docker-compose up -d database scraper
        ;;
    "web-only")
        echo "Iniciando apenas o serviço web..."
        docker-compose up -d database webservice
        ;;
    "prod")
        echo "Iniciando todos os serviços em modo de produção..."
        docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
        ;;
    "prod-build")
        echo "Reconstruindo e iniciando todos os serviços em modo de produção..."
        docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
        ;;
    *)
        echo "Uso: $0 {start|dev|stop|restart|build|logs|status|clean|ai-only|scraper-only|web-only|prod|prod-build}"
        echo ""
        echo "Comandos disponíveis:"
        echo "  start/dev      - Inicia todos os serviços (PADRÃO)"
        echo "  stop           - Para todos os serviços"
        echo "  restart        - Reinicia todos os serviços"
        echo "  build          - Reconstrói e inicia todos os serviços"
        echo "  logs           - Mostra logs de todos os serviços"
        echo "  logs-ai        - Mostra logs do serviço de IA"
        echo "  logs-scraper   - Mostra logs do serviço de scraping"
        echo "  logs-web       - Mostra logs do serviço web"
        echo "  logs-db        - Mostra logs do banco de dados"
        echo "  status         - Mostra status dos serviços"
        echo "  clean          - Limpa containers, volumes e imagens"
        echo "  ai-only        - Inicia apenas o serviço de IA"
        echo "  scraper-only   - Inicia apenas o serviço de scraping"
        echo "  web-only       - Inicia apenas o serviço web"
        echo "  prod           - Inicia todos os serviços em modo de produção"
        echo "  prod-build     - Reconstrói e inicia todos os serviços em modo de produção"
        exit 1
        ;;
esac

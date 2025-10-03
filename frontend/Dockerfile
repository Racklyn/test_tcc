# Dockerfile para o frontend Vue.js
FROM node:22-alpine as base

# Instalar dependências necessárias
RUN apk add --no-cache git

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# ===== STAGE: Development =====
FROM base as development

# Instalar todas as dependências (incluindo devDependencies)
RUN npm ci

# Copiar código fonte
COPY . .

# Expor porta do Vite
EXPOSE 5173

# Comando para desenvolvimento
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ===== STAGE: Build =====
FROM base as build

# Instalar todas as dependências para build
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# ===== STAGE: Production =====
FROM nginx:alpine as production

# Copiar arquivos buildados
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Expor porta 80
EXPOSE 80

# Comando para produção
CMD ["nginx", "-g", "daemon off;"]

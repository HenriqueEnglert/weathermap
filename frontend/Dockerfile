# --- ETAPA 1: Construção (Build) ---
# Usa o Node.js para compilar o projeto Vue/Vite
FROM node:20 AS build

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências usando o lockfile para builds reproduzíveis
RUN npm ci

# Copia o restante do código fonte do front-end
COPY . .

# Executa o comando de build (gera a pasta 'dist' com os arquivos estáticos)
RUN npm run build

# --- ETAPA 2: Servidor Web Leve (Nginx) ---
# Usa uma imagem do Nginx super enxuta para entregar a aplicação ao navegador
FROM nginx:alpine

# Copia apenas os arquivos estáticos gerados na Etapa 1 para a pasta padrão do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expõe a porta 80 para acesso web
EXPOSE 80

# Inicia o Nginx em primeiro plano
CMD ["nginx", "-g", "daemon off;"]

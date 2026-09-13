FROM node:20

# diretorio de trabalho
WORKDIR /app

# copia as dependencias - alivia o cache
COPY package*.json ./

# instala as dependencias
RUN npm ci --only=production

# copia o resto
COPY . .

# abre a port 3000
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "src/index.js"]
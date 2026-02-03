# Estágio 1: Build da aplicação
FROM node:20-alpine as build

WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# --- A MÁGICA ESTÁ AQUI ---
# O flag '--legacy-peer-deps' obriga o React 19 a instalar
# mesmo que o react-scripts reclame que não suporta ele ainda.
RUN npm install --legacy-peer-deps

COPY . .

# Executa o build (gera a pasta 'build')
RUN npm run build

# Estágio 2: Servidor Web
FROM nginx:alpine

# Copia a pasta 'build' (que é o padrão do Create React App/Craco)
COPY --from=build /app/build /usr/share/nginx/html

# Ajusta a porta para 8080 (Google Cloud Run)
RUN sed -i 's/listen[[:space:]]*80;/listen 8080;/g' /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

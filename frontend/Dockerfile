# Estágio 1: Build (Robustez Máxima)
FROM node:20-alpine as build

WORKDIR /app

# MUDANÇA CRÍTICA: Copiamos apenas o package.json inicialmente.
# Isso evita o erro "file not found" se o yarn.lock não existir.
COPY package.json ./

# MUDANÇA: Usamos YARN em vez de NPM
# O network-timeout evita falhas se a internet do build oscilar
RUN yarn install --network-timeout 100000

COPY . .

# Executa o build usando o script do package.json ("craco build")
RUN yarn build

# Estágio 2: Servidor Nginx (Leve e Rápido)
FROM nginx:alpine

# Copia a pasta 'build' gerada pelo Craco
COPY --from=build /app/build /usr/share/nginx/html

# Configura a porta 8080 para o Cloud Run
RUN sed -i 's/listen[[:space:]]*80;/listen 8080;/g' /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

# Estágio 1: Build (Usando Yarn)
FROM node:20-alpine as build

WORKDIR /app

# Copia os arquivos de definição de dependências
COPY package.json yarn.lock ./

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

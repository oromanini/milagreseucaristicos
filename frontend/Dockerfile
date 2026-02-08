# Estágio 1: Build
FROM node:20-alpine as build

WORKDIR /app

# Copia dependências
COPY package.json ./
RUN yarn install

# --- AQUI ESTAVA FALTANDO ---
# Recebe a variável que o deploy.yml envia
ARG REACT_APP_API_URL
# Grava a variável no ambiente para o React usar no build
ENV REACT_APP_API_URL=$REACT_APP_API_URL
# ----------------------------

COPY . .
RUN yarn build

# Estágio 2: Servidor Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
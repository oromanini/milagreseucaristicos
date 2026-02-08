# Estágio 1: Build do React
FROM node:20-alpine as build

WORKDIR /app

# Copia os arquivos de dependências
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# --- O SEGREDINHO ESTÁ AQUI ---
# Recebe a variável do GitHub Actions
ARG REACT_APP_API_URL
# Passa a variável para o ambiente do Build
ENV REACT_APP_API_URL=$REACT_APP_API_URL
# ------------------------------

# Copia o resto do código
COPY . .

# Faz o build (agora com a variável certa!)
RUN yarn build

# Estágio 2: Servidor Nginx (Produção)
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

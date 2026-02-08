# Estágio 1: Build
FROM node:20-alpine as build

WORKDIR /app

# Copia APENAS o package.json primeiro (para não quebrar se faltar o lock)
COPY package.json ./

# Tenta instalar. Se tiver yarn.lock local, ótimo. Se não, ele cria.
RUN yarn install

# --- A VARIÁVEL MÁGICA ---
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
# -------------------------

# Copia o resto dos arquivos
COPY . .

# Faz o build
RUN yarn build

# Estágio 2: Servidor (Produção)
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Copia a configuração do Nginx que criamos no Passo 1
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

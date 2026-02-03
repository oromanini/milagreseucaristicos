# Estágio 1: Build
FROM node:20-alpine as build

WORKDIR /app

# Copia os arquivos de dependência
COPY package.json yarn.lock ./

# Instala usando Yarn (mais robusto para conflitos de versão)
# O flag --network-timeout ajuda a não falhar em conexões lentas
RUN yarn install --network-timeout 100000

COPY . .

# Executa o build (gera a pasta 'build')
RUN yarn build

# Estágio 2: Servidor Nginx
FROM nginx:alpine

# MUDANÇA IMPORTANTE: O Craco gera a pasta 'build', não 'dist'
COPY --from=build /app/build /usr/share/nginx/html

# Configura o Nginx para rodar na porta 8080 (exigência do Cloud Run)
RUN sed -i 's/listen[[:space:]]*80;/listen 8080;/g' /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

FROM nginx:alpine

# Copia o conteúdo do frontend para o diretório padrão do nginx
COPY . /usr/share/nginx/html

# Expose a porta 80
EXPOSE 80

# Define o comando padrão para iniciar o nginx
CMD ["nginx", "-g", "daemon off;"]

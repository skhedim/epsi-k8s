FROM nginx
RUN apt update -y && \
    apt upgrade -y
COPY ./site /usr/share/nginx/html
EXPOSE 80
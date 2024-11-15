FROM nginx
COPY ./MachTarokTS/dist/ /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d/
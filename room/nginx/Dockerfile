# nginx/Dockerfile

FROM nginx:alpine

# Copy your custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy static assets (if you have any)
COPY static/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

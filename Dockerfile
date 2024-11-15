FROM nginx

# Copy commonly rebuilt assets
COPY ./MachTarokTS/dist/ /usr/share/nginx/html/

# Copy static assets that aren't rebuilt often
COPY ./assets/berghutten-deck/ /usr/share/nginx/html/assets/berghutten-deck/
COPY ./assets/default-deck/ /usr/share/nginx/html/assets/default-deck/
COPY ./assets/icons/ /usr/share/nginx/html/assets/icons/
COPY ./assets/industrie-und-gluck-deck/ /usr/share/nginx/html/assets/industrie-und-gluck-deck/
COPY ./assets/mach-deck-thumb/ /usr/share/nginx/html/assets/mach-deck-thumb/
COPY ./assets/mach-deck-web/ /usr/share/nginx/html/assets/mach-deck-web/
COPY ./assets/profile-pictures/ /usr/share/nginx/html/assets/profile-pictures/

COPY ./default.conf /etc/nginx/conf.d/
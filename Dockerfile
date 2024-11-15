FROM nginx

# Copy commonly rebuilt assets
COPY ./MachTarokTS/dist/ /usr/share/nginx/html/

# Copy static assets that aren't rebuilt often
COPY ./MachTarokTS/dist/assets/berghutten-deck/ /usr/share/nginx/html/assets/berghutten-deck/
COPY ./MachTarokTS/dist/assets/default-deck/ /usr/share/nginx/html/assets/default-deck/
COPY ./MachTarokTS/dist/assets/icons/ /usr/share/nginx/html/assets/icons/
COPY ./MachTarokTS/dist/assets/industrie-und-gluck-deck/ /usr/share/nginx/html/assets/industrie-und-gluck-deck/
COPY ./MachTarokTS/dist/assets/mach-deck-thumb/ /usr/share/nginx/html/assets/mach-deck-thumb/
COPY ./MachTarokTS/dist/assets/mach-deck-web/ /usr/share/nginx/html/assets/mach-deck-web/
COPY ./MachTarokTS/dist/assets/profile-pictures/ /usr/share/nginx/html/assets/profile-pictures/

COPY ./default.conf /etc/nginx/conf.d/
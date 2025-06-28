FROM node:18-alpine

WORKDIR /app

COPY dist/ dist/
COPY src/room-template.yaml dist/

CMD ["npm", "run", "start"]
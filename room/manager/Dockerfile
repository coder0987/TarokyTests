FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY dist/ dist/
COPY src/room-template.yaml dist/

CMD ["npm", "run", "start"]
# server/Dockerfile

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY dist/ dist/
COPY src/room-template.yaml dist/

ENV PORT=8449

EXPOSE 8449

CMD ["npm", "run", "start"]

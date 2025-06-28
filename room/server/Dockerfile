# server/Dockerfile

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY src/* .
COPY room-template.yaml .

ENV PORT=8449

EXPOSE 8449

CMD ["npm", "run", "start"]

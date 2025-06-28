FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY manager.ts .

CMD ["node", "manager.ts"]
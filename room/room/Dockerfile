# room/Dockerfile

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install


COPY dist/* .

ENV PORT=3000
ENV ROOM_ID=unknown

EXPOSE 3000

CMD ["npm", "run", "start"]

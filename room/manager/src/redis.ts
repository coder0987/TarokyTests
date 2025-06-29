import Redis from "ioredis";

const redisHost: string = process.env.REDIS_HOST || "localhost";
const redisPort: number = parseInt(process.env.REDIS_PORT || "6379", 10);
const redis = new Redis({ host: redisHost, port: redisPort });
const sub = new Redis({ host: redisHost, port: redisPort });



module.exports = { sub, redis };
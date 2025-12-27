const { createClient } = require("redis");

const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    },
});

redisClient.connect();
redisClient.on("connect", () => console.log("Redis connected"));

module.exports = redisClient;

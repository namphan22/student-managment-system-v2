const RedisStore = require('connect-redis').default;
const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379,
    password:process.env.myPassRedis
});

module.exports= {
    redisClient,
    RedisStore
}

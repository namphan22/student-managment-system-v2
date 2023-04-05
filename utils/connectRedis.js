const {redisClient}=  require('../config/redis-config');


const connectRedis = async()=>{
    try {
        await redisClient.connect();
        console.log('Connect to Redis successfully');
        
    } catch (error) {
        console.log('error',error.message);
        setTimeout(connectRedis,5000);
        
    }

}
module.exports = connectRedis;
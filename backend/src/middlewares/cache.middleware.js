// middlewares/cache.middleware.js
const redis = require('redis');
const RequestLog = require('../models/requestlog.model');
const Setting = require('../models/setting.model');

const client = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});
client.connect().catch(console.error);

const cache = (keyPrefix) => async (req, res, next) => {
    try {
        // Lấy TTL từ Setting DB
        const ttlSetting = await Setting.findByPk('CACHE_TTL');
        const ttl = ttlSetting ? parseInt(ttlSetting.value) : 60;

        // Xác định key
        let key;
        if (req.params.id) {
            // Single product
            key = `${keyPrefix}:${req.params.id}`;
        } else if (req.path.includes('advanced')) {
            // Advanced API: include query string
            key = `${keyPrefix}:${req.originalUrl}`;
        } else {
            // List API
            key = `${keyPrefix}:all`;
        }

        // Check cache
        const cachedData = await client.get(key);
        if (cachedData) {
            console.log(`Cache HIT: ${key}`);
            res.locals.isCached = true;

            // Ghi log request
            await RequestLog.create({
                endpoint: req.originalUrl,
                response_time: 0,
                is_cached: true
            });

            return res.status(200).json(JSON.parse(cachedData));
        }

        console.log(`Cache MISS: ${key}`);
        res.locals.cacheKey = key;
        res.locals.isCached = false;
        const start = Date.now();

        // Override res.json để lưu cache và log
        const originalJson = res.json.bind(res);
        res.json = async (body) => {
            const duration = Date.now() - start;

            // Ghi log request
            await RequestLog.create({
                endpoint: req.originalUrl,
                response_time: duration,
                is_cached: res.locals.isCached
            });

            // Lưu cache với TTL
            await client.setEx(key, ttl, JSON.stringify(body));

            return originalJson(body);
        };

        next();
    } catch (error) {
        console.error('Cache middleware error:', error);
        next();
    }
};

module.exports = cache;

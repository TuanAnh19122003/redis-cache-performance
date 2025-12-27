const Product = require('../models/product.model');
const RequestLog = require('../models/requestlog.model');
const Setting = require('../models/setting.model');
const redis = require('../config/redis');
const { Op } = require('sequelize');

class ProductService {

    static async getAllProducts() {
        const endpoint = '/products';
        const start = Date.now();
        const cacheKey = 'products:all';

        // Lấy TTL từ DB Setting
        const ttlSetting = await Setting.findByPk('CACHE_TTL');
        const ttl = ttlSetting ? parseInt(ttlSetting.value) : 60;

        const cached = await redis.get(cacheKey);
        if (cached) {
            await RequestLog.create({
                endpoint,
                response_time: Date.now() - start,
                is_cached: true
            });
            return JSON.parse(cached);
        }

        const products = await Product.findAll();
        await redis.set(cacheKey, JSON.stringify(products), 'EX', ttl);

        await RequestLog.create({
            endpoint,
            response_time: Date.now() - start,
            is_cached: false
        });

        return products;
    }

    static async getProductById(id) {
        const endpoint = `/products/${id}`;
        const start = Date.now();
        const cacheKey = `product:${id}`;

        const ttlSetting = await Setting.findByPk('CACHE_TTL');
        const ttl = ttlSetting ? parseInt(ttlSetting.value) : 60;

        const cached = await redis.get(cacheKey);
        if (cached) {
            await RequestLog.create({
                endpoint,
                response_time: Date.now() - start,
                is_cached: true
            });
            return JSON.parse(cached);
        }

        const product = await Product.findByPk(id);
        if (product) await redis.set(cacheKey, JSON.stringify(product), 'EX', ttl);

        await RequestLog.create({
            endpoint,
            response_time: Date.now() - start,
            is_cached: false
        });

        return product;
    }

    static async getProductsAdvanced({ page = 1, limit = 10, search, category, sort }) {
        const start = Date.now();

        const cacheKey = `products:advanced:${JSON.stringify({ page, limit, search, category, sort })}`;

        const ttlSetting = await Setting.findByPk('CACHE_TTL');
        const ttl = ttlSetting ? parseInt(ttlSetting.value) : 60;

        const cached = await redis.get(cacheKey);
        if (cached) {
            await RequestLog.create({
                endpoint: '/products/advanced',
                response_time: 0,
                is_cached: true
            });
            return JSON.parse(cached);
        }

        const where = {};
        if (search) where.name = { [Op.like]: `%${search}%` };
        if (category) where.categoryId = category;

        const order = [];
        if (sort) {
            const [field, direction] = sort.split(':');
            order.push([field, direction.toUpperCase()]);
        }

        const offset = (page - 1) * limit;

        const { rows, count } = await Product.findAndCountAll({
            where,
            order,
            limit: Number(limit),
            offset
        });

        const result = {
            data: rows,
            total: count,
            page: Number(page),
            limit: Number(limit)
        };

        await redis.set(cacheKey, JSON.stringify(result), 'EX', ttl);

        await RequestLog.create({
            endpoint: '/products/advanced',
            response_time: Date.now() - start,
            is_cached: false
        });

        return result;
    }

    // create/update/delete vẫn xóa cache cũ
    static async createProduct(data) {
        const newProduct = await Product.create(data);
        await redis.del('products:all');
        return newProduct;
    }

    static async updateProduct(id, data) {
        const product = await Product.findByPk(id);
        if (!product) throw new Error('Product not found');

        const updated = await product.update(data);
        await redis.del(`product:${id}`);
        await redis.del('products:all');
        return updated;
    }

    static async deleteProduct(id) {
        const product = await Product.findByPk(id);
        if (!product) throw new Error('Product not found');

        await product.destroy();
        await redis.del(`product:${id}`);
        await redis.del('products:all');
        return product;
    }
}

module.exports = ProductService;

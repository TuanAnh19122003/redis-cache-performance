const Product = require('../models/product.model');
const RequestLog = require('../models/requestlog.model');
const redis = require('../config/redis');
const { Op } = require('sequelize');

class ProductService {
    static CACHE_TTL = 60; // TTL cache 60 giây

    // Helper log request
    static async logRequest(endpoint, responseTime, isCached) {
        try {
            await RequestLog.create({
                endpoint,
                response_time: responseTime,
                is_cached: isCached
            });
        } catch (err) {
            console.error('Failed to log request:', err);
        }
    }

    static async getAllProducts() {
        const endpoint = '/products';
        const start = Date.now();
        const cacheKey = 'products:all';

        const cached = await redis.get(cacheKey);
        if (cached) {
            await this.logRequest(endpoint, Date.now() - start, true);
            return JSON.parse(cached);
        }

        const products = await Product.findAll();
        await redis.set(cacheKey, JSON.stringify(products), 'EX', this.CACHE_TTL);
        await this.logRequest(endpoint, Date.now() - start, false);

        return products;
    }

    static async getProductById(id) {
        const endpoint = `/products/${id}`;
        const start = Date.now();
        const cacheKey = `product:${id}`;

        const cached = await redis.get(cacheKey);
        if (cached) {
            await this.logRequest(endpoint, Date.now() - start, true);
            return JSON.parse(cached);
        }

        const product = await Product.findByPk(id);
        if (product) {
            await redis.set(cacheKey, JSON.stringify(product), 'EX', this.CACHE_TTL);
        }
        await this.logRequest(endpoint, Date.now() - start, false);

        return product;
    }

    static async createProduct(data) {
        const newProduct = await Product.create(data);
        await redis.del('products:all'); // xóa cache để cập nhật danh sách
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

    static async getProductsAdvanced({ page = 1, limit = 10, search, category, sort }) {
        const start = Date.now();

        // Cache key dựa trên query params
        const cacheKey = `products:advanced:${JSON.stringify({ page, limit, search, category, sort })}`;
        const cached = await redis.get(cacheKey);

        if (cached) {
            await RequestLog.create({
                endpoint: '/products/advanced',
                response_time: 0,
                is_cached: true
            });
            console.log('Cache HIT');
            return JSON.parse(cached);
        }

        console.log('Cache MISS');

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

        // Lưu cache
        await redis.setEx(cacheKey, this.CACHE_TTL, JSON.stringify(result));

        const duration = Date.now() - start;
        await RequestLog.create({
            endpoint: '/products/advanced',
            response_time: duration,
            is_cached: false
        });

        return result;
    }
}

module.exports = ProductService;

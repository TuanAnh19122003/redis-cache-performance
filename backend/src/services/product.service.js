const Product = require('../models/product.model');

class ProductService {
    static async getAllProducts() {
        const products = await Product.findAll();
        return products;
    }

    static async getProductById(id) {
        const product = await Product.findByPk(id);
        return product;
    }

    static async createProduct(productData) {
        const newProduct = await Product.create(productData);
        return newProduct;
    }

    static async updateProduct(id, productData) {
        const product = await Product.findByPk(id);
        if (!product) {
            throw new Error('Product not found');
        }
        return await product.update(productData);
    }

    static async deleteProduct(id) {
        const product = await Product.findByPk(id); 
        if (!product) {
            throw new Error('Product not found');
        }
        return await product.destroy();
    }

}

module.exports = ProductService;
const ProductService = require('../services/product.service');

class ProductController {
    async getAllProducts(req, res) {
        try {
            const products = await ProductService.getAllProducts();
            res.status(200).json({
                message: 'Products retrieved successfully',
                data: products
            });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    
    async getProductById(req, res) {
        try {
            const product = await ProductService.getProductById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json({
                message: 'Product retrieved successfully',
                data: product
            });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async createProduct(req, res) {
        try {
            const data = req.body;
            const newProduct = await ProductService.createProduct(data);
            res.status(201).json({
                message: 'Product created successfully',
                data: newProduct
            });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateProduct(req, res) {
        try {
            const data = req.body;
            const updatedProduct = await ProductService.updateProduct(req.params.id, data);
            if (!updatedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json({
                message: 'Product updated successfully',
                data: updatedProduct
            });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async deleteProduct(req, res) {
        try {
            const deletedProduct = await ProductService.deleteProduct(req.params.id);
            if (!deletedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json({
                message: 'Product deleted successfully',
                data: deletedProduct
            });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new ProductController();
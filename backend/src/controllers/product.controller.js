const ProductService = require('../services/product.service');

class ProductController {
    getAllProducts = async (req, res) => {
        try {
            const products = await ProductService.getAllProducts();
            res.status(200).json({ message: 'Products retrieved successfully', data: products });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    getProductById = async (req, res) => {
        try {
            const product = await ProductService.getProductById(req.params.id);
            if (!product) return res.status(404).json({ message: 'Product not found' });
            res.status(200).json({ message: 'Product retrieved successfully', data: product });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    createProduct = async (req, res) => {
        try {
            const newProduct = await ProductService.createProduct(req.body);
            res.status(201).json({ message: 'Product created successfully', data: newProduct });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    updateProduct = async (req, res) => {
        try {
            const updated = await ProductService.updateProduct(req.params.id, req.body);
            res.status(200).json({ message: 'Product updated successfully', data: updated });
        } catch (error) {
            if (error.message === 'Product not found') return res.status(404).json({ message: error.message });
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    deleteProduct = async (req, res) => {
        try {
            const deleted = await ProductService.deleteProduct(req.params.id);
            res.status(200).json({ message: 'Product deleted successfully', data: deleted });
        } catch (error) {
            if (error.message === 'Product not found') return res.status(404).json({ message: error.message });
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getProductsAdvanced(req, res) {
        try {
            const result = await ProductService.getProductsAdvanced(req.query);
            res.status(200).json({
                message: 'Products retrieved successfully',
                ...result
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new ProductController();

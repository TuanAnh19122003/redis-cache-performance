const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');
const cache = require('../middlewares/cache.middleware');

router.get('/advanced', cache('products:advanced'), ProductController.getProductsAdvanced);
router.get('/', cache('products'), ProductController.getAllProducts);
router.get('/:id', cache('product'), ProductController.getProductById);

router.post('/', ProductController.createProduct);
router.put('/:id', ProductController.updateProduct);
router.delete('/:id', ProductController.deleteProduct);

module.exports = router;

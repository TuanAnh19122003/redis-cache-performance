const express = require('express');
const router = express.Router();

const categoryRouter = require('./category.routes');
const userRouter = require('./user.routes');
const productRouter = require('./product.routes');

router.use('/categories', categoryRouter);
router.use('/users', userRouter);
router.use('/products', productRouter);

module.exports = router;
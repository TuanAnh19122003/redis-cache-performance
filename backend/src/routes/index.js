const express = require('express');
const router = express.Router();

const categoryRouter = require('./category.routes');
const userRouter = require('./user.routes');
const productRouter = require('./product.routes');
const requestlogRouter = require('./requestLog.routes');
const settingRouter = require('./setting.routes');

router.use('/categories', categoryRouter);
router.use('/users', userRouter);
router.use('/products', productRouter);
router.use('/requestlogs', requestlogRouter);
router.use('/settings', settingRouter);

module.exports = router;
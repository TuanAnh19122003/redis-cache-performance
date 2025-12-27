const express = require('express');
const router = express.Router();

const categoryRouter = require('./category.routes');
const userRouter = require('./user.routes');

router.use('/categories', categoryRouter);
router.use('/users', userRouter);

module.exports = router;
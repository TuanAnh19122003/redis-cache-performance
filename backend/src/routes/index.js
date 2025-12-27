const express = require('express');
const router = express.Router();

const categoryRouter = require('./category.routes');

router.use('/categories', categoryRouter);

module.exports = router;
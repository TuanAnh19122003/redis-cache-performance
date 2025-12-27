const express = require('express');
const router = express.Router();
const RequestLogController = require('../controllers/requestLog.controller');

router.get('/', RequestLogController.getAllLogs);
router.get('/:endpoint', RequestLogController.getLogsByEndpoint);

module.exports = router;

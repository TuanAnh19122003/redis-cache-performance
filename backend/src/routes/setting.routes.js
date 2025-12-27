const express = require('express');
const router = express.Router();
const SettingController = require('../controllers/setting.controller');

router.get('/', SettingController.getAllSettings);
router.put('/:key', SettingController.updateSetting);

module.exports = router;

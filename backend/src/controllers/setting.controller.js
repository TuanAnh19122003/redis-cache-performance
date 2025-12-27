const SettingService = require('../services/setting.service');

class SettingController {
    async getAllSettings(req, res) {
        try {
            const settings = await SettingService.getAllSettings();
            res.status(200).json({ message: 'Settings retrieved', data: settings });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateSetting(req, res) {
        try {
            const updated = await SettingService.updateSetting(req.params.key, req.body.value);
            res.status(200).json({ message: 'Setting updated', data: updated });
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
}

module.exports = new SettingController();
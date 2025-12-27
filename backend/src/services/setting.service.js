const Setting = require('../models/setting.model');

class SettingService {
    static async getAllSettings() {
        return await Setting.findAll();
    }

    static async updateSetting(key, value) {
        const setting = await Setting.findByPk(key);
        if (!setting) {
            throw new Error('Setting not found');
        }
        return await setting.update({ value });
    }
}

module.exports = SettingService;
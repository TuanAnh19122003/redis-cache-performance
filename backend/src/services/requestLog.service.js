const RequestLog = require('../models/requestlog.model');

class RequestLogService {
    static async getAllLogs() {
        return await RequestLog.findAll({ order: [['created_at', 'DESC']] });
    }

    static async getLogsByEndpoint(endpoint) {
        return await RequestLog.findAll({
            where: { endpoint },
            order: [['created_at', 'DESC']]
        });
    }
}

module.exports = RequestLogService;
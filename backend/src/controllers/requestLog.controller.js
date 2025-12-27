const RequestLogService = require('../services/requestLog.service');

class RequestLogController {
    async getAllLogs(req, res) {
        try {
            const logs = await RequestLogService.getAllLogs();
            res.status(200).json({ message: 'Logs retrieved', data: logs });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getLogsByEndpoint(req, res) {
        try {
            const logs = await RequestLogService.getLogsByEndpoint(req.params.endpoint);
            res.status(200).json({ message: 'Logs retrieved', data: logs });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new RequestLogController();

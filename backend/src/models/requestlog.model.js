const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const RequestLog = sequelize.define('RequestLog', {
id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    endpoint: {
      type: DataTypes.STRING,
      allowNull: false
    },
    response_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Thời gian xử lý request (ms)'
    },
    is_cached: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      comment: 'Request có sử dụng cache Redis hay không'
    }
}, {
    tableName: 'request_logs',
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = RequestLog;
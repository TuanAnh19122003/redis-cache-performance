const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Setting = sequelize.define('Setting', {
    key: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'settings',
    timestamps: false
});

module.exports = Setting;
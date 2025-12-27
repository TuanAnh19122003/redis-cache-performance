const sequelize = require('../config/database');
const User = require('./user.model');
const Product = require('./product.model');
const Category = require('./category.model');
const RequestLog = require('./requestlog.model');
const Setting = require('./setting.model');


const db = {
    User,
    Product,
    Category,
    RequestLog,
    Setting
}

require('./initRelationships')(db);

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Connection successful');
    })
    .catch((error) => {
        console.error('Connection error:', error);
        throw error;
    });

module.exports = db;
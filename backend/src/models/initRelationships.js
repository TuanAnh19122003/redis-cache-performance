module.exports = (db) => {
    const { User, Category, Product } = db;

    Category.hasMany(Product, {
        foreignKey: 'categoryId',
        as: 'products'
    });

    Product.belongsTo(Category, {
        foreignKey: 'categoryId',
        as: 'category'
    });

    User.hasMany(Product, {
        foreignKey: 'userId',
        as: 'products'
    });

    Product.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user'
    });
};

module.exports = (db) => {
    const { User, Category, Product } = db;

    const fk = (name) => ({
        foreignKey: { name, allowNull: false },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    });

    User.hasMany(Product, { foreignKey: 'userId', as: 'products' });
    Product.belongsTo(User, { ...fk('userId'), as: 'user' });

    Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
    Product.belongsTo(Category, { ...fk('categoryId'), as: 'category' });
};

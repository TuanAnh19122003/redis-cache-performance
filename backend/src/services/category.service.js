const Category = require("../models/category.model");

class CategoryService {
    static async getAllCategories() {
        const categories = await Category.findAll();
        return categories;
    }

    static async createCategory(data) {
        const category = await Category.create(data);
        return category;
    }

    static async getCategoryById(id) {
        const category = await Category.findByPk(id);
        return category;
    }

    static async updateCategory(id, data) {
        const category = await Category.findByPk(id);
        if (!category) {
            throw new Error('Category not found');
        }
        return await category.update(data);
    }

    static async deleteCategory(id) {
        const category = await Category.findByPk(id);
        if (!category) {
            throw new Error('Category not found');
        }
        return await category.destroy();
        
    }

}

module.exports = CategoryService;
const CategoryService = require("../services/category.service");

class CategoryController {
    async getAllCategories(req, res) {
        try {
            const categories = await CategoryService.getAllCategories();
            res.status(200).json({
                message: 'Categories retrieved successfully',
                data: categories
            });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async createCategory(req, res) {
        try {
            const category = await CategoryService.createCategory(req.body);
            res.status(201).json({
                message: 'Category created successfully',
                data: category
            });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getCategoryById(req, res) {
        try {
            const category = await CategoryService.getCategoryById(req.params.id);
            res.status(200).json({
                message: 'Category retrieved successfully',
                data: category
            });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateCategory(req, res) {
        try {
            const category = await CategoryService.updateCategory(req.params.id, req.body);
            res.status(200).json({
                message: 'Category updated successfully',
                data: category
            });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async deleteCategory(req, res) {
        try {
            await CategoryService.deleteCategory(req.params.id);
            res.status(200).json({
                message: 'Category deleted successfully'
            });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

}

module.exports = new CategoryController();
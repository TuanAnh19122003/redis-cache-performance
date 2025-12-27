const UserService = require('../services/user.service');

class UserController {
    async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            res.status(200).json({
                message: 'Users retrieved successfully',
                data: users
            });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await UserService.getUserById(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({
                message: 'User retrieved successfully',
                data: user
            });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async createUser(req, res) {
        try {
            const data = req.body;
            const newUser = await UserService.createUser(data);
            res.status(201).json({
                message: 'User created successfully',
                data: newUser
            });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const updatedUser = await UserService.updateUser(id, data);
            res.status(200).json({
                message: 'User updated successfully',
                data: updatedUser
            });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            await UserService.deleteUser(id);
            res.status(200).json({
                message: 'User deleted successfully'
            });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new UserController();
const User = require('../models/user.model');

class UserService {
    static async getAllUsers() {
        const users = await User.findAll();
        return users;
    }

    static async getUserById(id) {
        const user = await User.findByPk(id);
        return user;
    }

    static async createUser(userData) {
        const newUser = await User.create(userData);
        return newUser;
    }

    static async updateUser(id, userData) {
        const user = await User.findByPk(id);
        if (!user) {
            throw new Error('User not found');
        }
        return await user.update(userData);
    }

    static async deleteUser(id) {
        const user = await User.findByPk(id);
        if (!user) {
            throw new Error('User not found');
        }
        return await user.destroy();
    }
}

module.exports = UserService;
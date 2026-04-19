const UserService = require('../services/UserService');

class UserController {
  constructor() {
    this.userService = new UserService();
    this.getAllUsers = this.getAllUsers.bind(this);
    this.updateRole = this.updateRole.bind(this);
  }

  async getAllUsers(req, res, next) {
    try {
      const users = await this.userService.getAllUsers();
      res.json({ success: true, users });
    } catch (err) {
      next(err);
    }
  }

  async updateRole(req, res, next) {
    try {
      const user = await this.userService.updateRole(req.params.id, req.body.role);
      res.json({ success: true, user });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;

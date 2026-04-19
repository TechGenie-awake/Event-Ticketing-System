const UserRepository = require('../repositories/UserRepository');

class UserService {
  constructor() {
    this.userRepo = new UserRepository();
  }

  async getAllUsers() {
    return this.userRepo.findAll();
  }

  async updateRole(id, role) {
    if (!['USER', 'ADMIN'].includes(role)) {
      throw new Error('Invalid role');
    }
    return this.userRepo.update(id, { role });
  }
}

module.exports = UserService;

const AuthService = require('../services/AuthService');

class AuthController {
  constructor() {
    this.authService = new AuthService();
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  async register(req, res, next) {
    try {
      const { name, email, password, phone } = req.body;
      const result = await this.authService.register(name, email, password, phone);
      res.status(201).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = await this.authService.getProfile(req.user.id);
      res.json({ success: true, user });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthController;

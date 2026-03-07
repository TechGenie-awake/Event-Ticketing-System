const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');

class AuthService {
  constructor() {
    this.userRepo = new UserRepository();
  }

  async register(name, email, password, phone) {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      throw new Error('Email already in use');
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await this.userRepo.create({ name, email, password: hashed, phone });

    const token = this._generateToken(user);
    return { user: this._sanitize(user), token };
  }

  async login(email, password) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error('Invalid credentials');
    }

    const token = this._generateToken(user);
    return { user: this._sanitize(user), token };
  }

  async getProfile(userId) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error('User not found');
    return this._sanitize(user);
  }

  _generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  _sanitize(user) {
    const { password, ...rest } = user;
    return rest;
  }
}

module.exports = AuthService;

const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_banget_dah';

class AuthService {
  async register(email, password) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw { status: 400, message: "Email sudah terdaftar!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.create({
      email,
      password: hashedPassword
    });

    return { id: user.id, email: user.email };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw { status: 401, message: "Email atau password salah!" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw { status: 401, message: "Email atau password salah!" };
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return { token, user: { id: user.id, email: user.email } };
  }
}

module.exports = new AuthService();

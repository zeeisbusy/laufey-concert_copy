const authService = require('../services/authService');
const AppError = require('../middlewares/errorMiddleware');

class AuthController {
  async register(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await authService.register(email, password);
      
      res.status(201).json({
        success: true,
        message: "Registrasi berhasil!",
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      
      res.status(200).json({
        success: true,
        message: "Login berhasil!",
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();

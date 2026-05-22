const authService = require('../services/authService');

class AuthController {
  async register(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email dan password wajib diisi!" });
      }

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
      if (!email || !password) {
        return res.status(400).json({ message: "Email dan password wajib diisi!" });
      }

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

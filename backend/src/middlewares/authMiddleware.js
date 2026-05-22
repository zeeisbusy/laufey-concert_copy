const jwt = require('jsonwebtoken');
const AppError = require('./errorMiddleware');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_banget_dah';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Anda belum login! Silakan login untuk mendapatkan akses.', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return next(new AppError('Token tidak valid atau sudah kadaluarsa!', 401));
  }
};

module.exports = authMiddleware;

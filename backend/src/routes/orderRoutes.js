const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Order membutuhkan autentikasi (Protected Route)
router.post('/orders', authMiddleware, orderController.createOrder);

module.exports = router;

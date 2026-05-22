const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validationMiddleware');
const { orderSchema } = require('../validations/schemas');

const router = express.Router();

// Semua route di sini butuh login
router.use(authMiddleware);

router.post('/', validate(orderSchema), orderController.create);
router.get('/my-orders', orderController.getUserOrders);

module.exports = router;

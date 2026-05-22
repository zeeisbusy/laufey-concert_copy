const orderService = require('../services/orderService');

class OrderController {
  async create(req, res, next) {
    try {
      const { seatId, quantity } = req.body;
      const userId = req.user.id;

      const order = await orderService.createOrder(userId, seatId, quantity);

      res.status(201).json({
        success: true,
        message: "Pemesanan tiket berhasil!",
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserOrders(req, res, next) {
    try {
      const userId = req.user.id;
      const orders = await orderService.getUserOrders(userId);

      res.status(200).json({
        success: true,
        data: orders
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrderController();

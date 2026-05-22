const orderService = require('../services/orderService');

class OrderController {
  async createOrder(req, res, next) {
    try {
      const { seatId, quantity } = req.body;
      
      // Ambil userId dari JWT Token yang sudah didecode oleh middleware
      const userId = req.user.id; 

      if (!seatId || !quantity) {
        return res.status(400).json({ message: "Seat ID dan Quantity wajib diisi!" });
      }

      // Jalankan logika bisnis di service
      const order = await orderService.checkoutTicket(userId, seatId, quantity);

      return res.status(201).json({
        success: true,
        message: "Pemesanan tiket berhasil!",
        data: order
      });

    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrderController();

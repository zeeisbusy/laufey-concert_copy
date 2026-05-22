const orderRepository = require('../repositories/orderRepository');
const eventRepository = require('../repositories/eventRepository');
const AppError = require('../middlewares/errorMiddleware');

class OrderService {
  async createOrder(userId, seatId, quantity) {
    // 1. Cek ketersediaan kursi
    const seat = await eventRepository.findSeatById(seatId);
    if (!seat) {
      throw new AppError('Kursi tidak ditemukan!', 404);
    }

    if (seat.stock < quantity) {
      throw new AppError(`Maaf, stok tiket habis atau tidak mencukupi. Sisa: ${seat.stock}`, 400);
    }

    // 2. Buat transaksi pesanan (Dalam real-world gunakan Prisma Transaction)
    const order = await orderRepository.create({
      userId,
      seatId,
      quantity
    });

    // 3. Update stok kursi
    await eventRepository.updateSeatStock(seatId, seat.stock - quantity);

    return order;
  }

  async getUserOrders(userId) {
    return await orderRepository.findByUserId(userId);
  }
}

module.exports = new OrderService();

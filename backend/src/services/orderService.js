const orderRepository = require('../repositories/orderRepository');

class OrderService {
  async checkoutTicket(userId, seatId, quantity) {
    // 1. Cari tahu dulu tiket yang mau dibeli ada atau tidak
    const seat = await orderRepository.findSeatById(seatId);
    if (!seat) {
      throw { status: 404, message: "Kategori tiket tidak ditemukan!" };
    }

    // 2. VALIDASI UTAMA: Jika stok tidak cukup, lempar error status 400
    if (seat.stock < quantity) {
      throw { status: 400, message: "Maaf banget, kategori tiket ini sudah habis!" };
    }

    // 3. Jika aman, jalankan fungsi transaksi di repository
    const [updatedSeat, newOrder] = await orderRepository.createOrderWithTransaction(userId, seatId, quantity);
    
    return newOrder;
  }
}

module.exports = new OrderService();
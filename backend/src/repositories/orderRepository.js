const prisma = require('../prisma'); // Memakai instance prisma kamu

class OrderRepository {
  // 1. Ambil data tipe kursi/tiket berdasarkan ID untuk cek stok nanti
  async findSeatById(seatId) {
    return await prisma.seat.findUnique({
      where: { id: Number(seatId) }
    });
  }

  // 2. Transaksi: Kurangi stok kursi dan buat data Order baru secara bersamaan
  async createOrderWithTransaction(userId, seatId, quantity) {
    return await prisma.$transaction([
      // Kurangi stok kursi
      prisma.seat.update({
        where: { id: Number(seatId) },
        data: { stock: { decrement: Number(quantity) } }
      }),
      // Buat data order baru
      prisma.order.create({
        data: {
          userId: Number(userId),
          seatId: Number(seatId),
          quantity: Number(quantity),
          status: 'SUCCESS'
        }
      })
    ]);
  }
}

module.exports = new OrderRepository();
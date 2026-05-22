const prisma = require('../prisma');

class EventRepository {
  async findAll() {
    return await prisma.event.findMany({
      include: { seats: true }
    });
  }

  async findById(id) {
    return await prisma.event.findUnique({
      where: { id: parseInt(id) },
      include: { seats: true }
    });
  }

  async findSeatById(seatId) {
    return await prisma.seat.findUnique({
      where: { id: parseInt(seatId) }
    });
  }

  async updateSeatStock(seatId, newStock) {
    return await prisma.seat.update({
      where: { id: parseInt(seatId) },
      data: { stock: newStock }
    });
  }
}

module.exports = new EventRepository();

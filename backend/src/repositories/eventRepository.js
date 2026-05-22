const prisma = require('../prisma');

class EventRepository {
  async findAll() {
    return await prisma.event.findMany({
      include: {
        seats: true
      }
    });
  }

  async findById(id) {
    return await prisma.event.findUnique({
      where: { id: Number(id) },
      include: {
        seats: true
      }
    });
  }
}

module.exports = new EventRepository();

const eventRepository = require('../repositories/eventRepository');

class EventService {
  async getAllEvents() {
    return await eventRepository.findAll();
  }

  async getEventById(id) {
    const event = await eventRepository.findById(id);
    if (!event) {
      throw { status: 404, message: "Event tidak ditemukan!" };
    }
    return event;
  }
}

module.exports = new EventService();

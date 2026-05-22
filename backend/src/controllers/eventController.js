const eventService = require('../services/eventService');

class EventController {
  async getEvents(req, res, next) {
    try {
      const events = await eventService.getAllEvents();
      res.status(200).json({
        success: true,
        data: events
      });
    } catch (error) {
      next(error);
    }
  }

  async getEventDetail(req, res, next) {
    try {
      const { id } = req.params;
      const event = await eventService.getEventById(id);
      res.status(200).json({
        success: true,
        data: event
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EventController();

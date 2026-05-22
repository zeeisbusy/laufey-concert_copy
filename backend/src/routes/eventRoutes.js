const express = require("express");
const eventController = require("../controllers/eventController");

const router = express.Router();

router.get("/", eventController.getEvents);
router.get("/:id", eventController.getEventDetail);

module.exports = router;

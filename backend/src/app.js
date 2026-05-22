const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// 1. MIDDLEWARE
app.use(cors());
app.use(express.json());

// 2. ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api", orderRoutes); // /api/orders

// 3. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  
  res.status(status).json({
    success: false,
    message: message,
  });
});

module.exports = app;

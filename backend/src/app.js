const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const orderRoutes = require("./routes/orderRoutes");
const AppError = require("./middlewares/errorMiddleware");

const app = express();

// 1. SECURITY MIDDLEWARE
app.use(helmet()); // Menambah security headers
app.use(cors());
app.use(express.json());

// Limit requests dari IP yang sama
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // Maksimal 100 request per IP
  message: "Terlalu banyak request dari IP ini, silakan coba lagi nanti."
});
app.use("/api", limiter);

// 2. ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/orders", orderRoutes);

// 3. UNHANDLED ROUTES
app.all("*", (req, res, next) => {
  next(new AppError(`Tidak dapat menemukan ${req.originalUrl} di server ini!`, 404));
});

// 4. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  console.error('ERROR 💥', err);

  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

module.exports = app;

// src/middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error(err.stack)
  const statusCode = err.statusCode || 500
  const message = err.message || "Server error. Please try again later."
  res.status(statusCode).json({ error: message })
}

module.exports = errorHandler

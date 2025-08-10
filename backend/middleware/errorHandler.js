export default function errorHandler(err, req, res, next) {
  // Log full error in server logs
  console.error("Error:", err);

  // Known validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "ValidationError",
      message: err.message,
      details: err.errors || null,
    });
  }

  // CastError for invalid ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({
      error: "BadRequest",
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // Custom error with status
  if (err.status) {
    return res.status(err.status).json({
      error: err.code || "Error",
      message: err.message,
    });
  }

  // Fallback
  res.status(500).json({ error: "InternalServerError", message: "Internal Server Error" });
}

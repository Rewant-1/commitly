export default function errorHandler(err, req, res, next) {
  // server logs
  console.error("Error:", err);

  // mongoose validation
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "ValidationError",
      message: err.message,
      details: err.errors || null,
    });
  }

  // bad ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({
      error: "BadRequest",
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // custom status
  if (err.status) {
    return res.status(err.status).json({
      error: err.code || "Error",
      message: err.message,
    });
  }

  res.status(500).json({ error: "InternalServerError", message: "Internal Server Error" });
}

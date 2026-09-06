import { sendError } from "../utils/response.js";

export function notFoundHandler(req, res) {
  return sendError(res, `Endpoint not found: ${req.method} ${req.originalUrl}`, null, 404);
}

export function globalErrorHandler(err, _req, res, _next) {
  console.error("Unhandled API Error:", err);
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || "An unexpected error occurred on the server";
  return sendError(res, message, err, statusCode);
}

/**
 * Standardized API response utilities.
 * Ensures consistent JSON payload structure:
 * { success: boolean, message: string, data?: any, error?: string }
 * Backwards compatibility is preserved by spreading data at the top level when appropriate.
 */

export function sendSuccess(res, message = "Operation successful", data = null, statusCode = 200) {
  const payload = {
    success: true,
    message,
  };

  if (data !== null && data !== undefined) {
    payload.data = data;

    // Spread top-level keys if data is a plain object for legacy frontend compatibility
    if (typeof data === "object" && !Array.isArray(data)) {
      Object.assign(payload, data);
    }
  }

  return res.status(statusCode).json(payload);
}

export function sendError(res, message = "Internal server error", error = null, statusCode = 500) {
  const payload = {
    success: false,
    message,
  };

  if (error) {
    payload.error = typeof error === "string" ? error : error.message || String(error);
  }

  return res.status(statusCode).json(payload);
}

class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // Marks it as an operational error
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;

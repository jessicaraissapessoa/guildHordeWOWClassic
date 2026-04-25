class AppError extends Error {
  constructor(statusCode, error, message, details = []) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
    this.details = details;
  }
}

module.exports = AppError;

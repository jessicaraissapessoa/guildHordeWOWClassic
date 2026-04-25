const AppError = require('../errors/AppError');

function errorHandler(error, req, res, _next) {
  if (error && error.code === 'ER_DUP_ENTRY') {
    error = new AppError(
      409,
      'BUSINESS_RULE_CONFLICT',
      'Operation violates a business rule.'
    );
  }

  const appError =
    error instanceof AppError
      ? error
      : new AppError(500, 'INTERNAL_SERVER_ERROR', 'An unexpected error occurred.');

  return res.status(appError.statusCode).json({
    statusCode: appError.statusCode,
    error: appError.error,
    message: appError.message,
    details: appError.details,
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  });
}

module.exports = errorHandler;

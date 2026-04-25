const rateLimit = require('express-rate-limit');

function buildRateLimit(max, windowMs) {
  return rateLimit({
    windowMs,
    limit: max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      statusCode: 429,
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later.',
      details: []
    },
    handler(req, res, _next, options) {
      return res.status(options.statusCode).json({
        ...options.message,
        timestamp: new Date().toISOString(),
        path: req.originalUrl
      });
    }
  });
}

module.exports = {
  authRateLimit: buildRateLimit(10, 60 * 1000)
};

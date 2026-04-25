function notFoundHandler(req, res) {
  return res.status(404).json({
    statusCode: 404,
    error: 'NOT_FOUND',
    message: 'Resource not found.',
    details: [],
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  });
}

module.exports = notFoundHandler;

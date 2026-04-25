const jwt = require('jsonwebtoken');
const env = require('../config/env');
const AppError = require('../errors/AppError');

function authMiddleware(req, _res, next) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(
      new AppError(401, 'UNAUTHORIZED', 'Authentication is required to access this resource.')
    );
  }

  const token = authorization.slice('Bearer '.length).trim();

  try {
    const payload = jwt.verify(token, env.jwt.secret);
    req.auth = {
      userId: Number(payload.sub),
      username: payload.username
    };
    return next();
  } catch (_error) {
    return next(
      new AppError(401, 'UNAUTHORIZED', 'Authentication is required to access this resource.')
    );
  }
}

module.exports = authMiddleware;

const express = require('express');
const authController = require('../controllers/auth-controller');
const asyncHandler = require('../utils/async-handler');
const { authRateLimit } = require('../middlewares/rate-limit');

const router = express.Router();

router
  .route('/register')
  .post(authRateLimit, asyncHandler(authController.register))
  .all((_req, res) => res.status(405).json({
    statusCode: 405,
    error: 'METHOD_NOT_ALLOWED',
    message: 'Method not allowed.',
    details: [],
    timestamp: new Date().toISOString(),
    path: '/auth/register'
  }));

router
  .route('/login')
  .post(authRateLimit, asyncHandler(authController.login))
  .all((_req, res) => res.status(405).json({
    statusCode: 405,
    error: 'METHOD_NOT_ALLOWED',
    message: 'Method not allowed.',
    details: [],
    timestamp: new Date().toISOString(),
    path: '/auth/login'
  }));

module.exports = router;

const express = require('express');
const usersController = require('../controllers/users-controller');
const asyncHandler = require('../utils/async-handler');

const router = express.Router();

router
  .route('/')
  .get(asyncHandler(usersController.listUsers))
  .all((req, res) =>
    res.status(405).json({
      statusCode: 405,
      error: 'METHOD_NOT_ALLOWED',
      message: 'Method not allowed.',
      details: [],
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    })
  );

router
  .route('/me')
  .delete(asyncHandler(usersController.deleteOwnUser))
  .all((req, res) =>
    res.status(405).json({
      statusCode: 405,
      error: 'METHOD_NOT_ALLOWED',
      message: 'Method not allowed.',
      details: [],
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    })
  );

router
  .route('/me/role-type')
  .patch(asyncHandler(usersController.updateOwnRoleType))
  .all((req, res) =>
    res.status(405).json({
      statusCode: 405,
      error: 'METHOD_NOT_ALLOWED',
      message: 'Method not allowed.',
      details: [],
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    })
  );

module.exports = router;

const express = require('express');
const guildsController = require('../controllers/guilds-controller');
const asyncHandler = require('../utils/async-handler');

const router = express.Router();

router
  .route('/')
  .get(asyncHandler(guildsController.listGuilds))
  .post(asyncHandler(guildsController.createGuild))
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
  .delete(asyncHandler(guildsController.deleteOwnGuild))
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
  .route('/me/leave')
  .post(asyncHandler(guildsController.leaveOwnGuild))
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
  .route('/members')
  .post(asyncHandler(guildsController.addGuildMember))
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
  .route('/members/:characterName/rank')
  .patch(asyncHandler(guildsController.updateGuildMemberRank))
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
  .route('/members/:characterName')
  .delete(asyncHandler(guildsController.removeGuildMember))
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
  .route('/:guildName/members')
  .get(asyncHandler(guildsController.listGuildMembers))
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

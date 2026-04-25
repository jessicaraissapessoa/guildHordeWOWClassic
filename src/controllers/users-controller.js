const userService = require('../services/user-service');

async function listUsers(req, res) {
  const result = await userService.listUsers(req.query);
  return res.status(200).json(result);
}

async function updateOwnRoleType(req, res) {
  const user = await userService.updateOwnRoleType(req.auth.userId, req.body);
  return res.status(200).json(user);
}

async function deleteOwnUser(req, res) {
  await userService.deleteOwnUser(req.auth.userId);
  return res.status(204).send();
}

module.exports = {
  listUsers,
  updateOwnRoleType,
  deleteOwnUser
};

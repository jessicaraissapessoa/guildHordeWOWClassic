const authService = require('../services/auth-service');

async function register(req, res) {
  const user = await authService.register(req.body);
  return res.status(201).json(user);
}

async function login(req, res) {
  const result = await authService.login(req.body);
  return res.status(200).json(result);
}

module.exports = {
  register,
  login
};

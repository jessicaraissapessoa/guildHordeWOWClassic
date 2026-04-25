const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../../src/app');
const env = require('../../../src/config/env');

async function registerUser(user) {
  return request(app).post('/auth/register').send(user);
}

async function loginUser(username, password = 'Senha@123') {
  const response = await request(app)
    .post('/auth/login')
    .send({ username, password });

  return response;
}

async function authHeaderFor(user) {
  await registerUser(user);
  const loginResponse = await loginUser(user.username, user.password);

  return {
    Authorization: `Bearer ${loginResponse.body.accessToken}`
  };
}

function buildExpiredToken({ userId = 9999, username = 'usuario.expirado' } = {}) {
  return jwt.sign(
    { username },
    env.jwt.secret,
    {
      subject: String(userId),
      expiresIn: -1
    }
  );
}

module.exports = {
  registerUser,
  loginUser,
  authHeaderFor,
  buildExpiredToken
};

const { expect } = require('chai');
const request = require('supertest');
const app = require('../../src/app');
const { buildUser } = require('./helpers/factory');
const { authHeaderFor, buildExpiredToken } = require('./helpers/auth');

describe('Segurança e contrato HTTP da API', () => {
  it('CT-042 deve rejeitar acesso sem token em endpoint protegido', async () => {
    const response = await request(app).get('/users');

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('UNAUTHORIZED');
  });

  it('CT-043 deve rejeitar acesso com token inválido', async () => {
    const response = await request(app)
      .get('/users')
      .set({ Authorization: 'Bearer token-invalido' });

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('UNAUTHORIZED');
  });

  it('CT-044 deve rejeitar acesso com token expirado', async () => {
    const user = buildUser();
    await authHeaderFor(user);

    const response = await request(app)
      .get('/users')
      .set({ Authorization: `Bearer ${buildExpiredToken({ username: user.username })}` });

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('UNAUTHORIZED');
  });

  it('CT-045 deve rejeitar método HTTP indevido em rota existente', async () => {
    const user = buildUser();
    const headers = await authHeaderFor(user);

    const response = await request(app)
      .post('/users')
      .set(headers);

    expect(response.status).to.equal(405);
    expect(response.body.error).to.equal('METHOD_NOT_ALLOWED');
  });
});

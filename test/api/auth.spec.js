const express = require('express');
const { expect } = require('chai');
const request = require('supertest');
const app = require('../../src/app');
const errorHandler = require('../../src/middlewares/error-handler');
const { buildUser } = require('./helpers/factory');
const { registerUser } = require('./helpers/auth');
const {
  buscarUsuarioPorUsername
} = require('./helpers/state');

function criarAplicacaoDeAutenticacaoComRateLimitAtivo() {
  const originalNodeEnv = process.env.NODE_ENV;
  const caminhoRateLimit = require.resolve('../../src/middlewares/rate-limit');
  const caminhoRotasAuth = require.resolve('../../src/routes/auth-routes');

  delete require.cache[caminhoRateLimit];
  delete require.cache[caminhoRotasAuth];
  process.env.NODE_ENV = 'development';

  const authRoutes = require('../../src/routes/auth-routes');
  const appComRateLimit = express();
  appComRateLimit.use(express.json());
  appComRateLimit.use('/auth', authRoutes);
  appComRateLimit.use(errorHandler);

  delete require.cache[caminhoRateLimit];
  delete require.cache[caminhoRotasAuth];
  process.env.NODE_ENV = originalNodeEnv;

  return appComRateLimit;
}

describe('Autenticação da API', () => {
  it('CT-001 deve cadastrar usuário com sucesso', async () => {
    const payload = buildUser({ class: 'xamã', roleType: 'dps' });

    const response = await request(app).post('/auth/register').send(payload);

    expect(response.status).to.equal(201);
    expect(response.body.username).to.equal(payload.username);
    expect(response.body.class).to.equal('Xamã');
    expect(response.body.roleType).to.equal('DPS');
    expect(response.body.guildName).to.equal(null);
    expect(response.body.guildRank).to.equal(null);
    expect(response.body).to.not.have.property('password');
    expect(response.body).to.not.have.property('passwordHash');

    const usuarioPersistido = await buscarUsuarioPorUsername(payload.username);
    expect(usuarioPersistido).to.not.equal(null);
    expect(usuarioPersistido.passwordHash).to.be.a('string');
    expect(usuarioPersistido.passwordHash).to.not.equal(payload.password);
    expect(usuarioPersistido.guildId).to.equal(null);
    expect(usuarioPersistido.guildRank).to.equal(null);
  });

  it('CT-002 deve bloquear username duplicado', async () => {
    const payload = buildUser({ username: 'dup.user' });

    await registerUser(payload);
    const response = await registerUser(
      buildUser({ ...payload, characterName: 'Outrox' })
    );

    expect(response.status).to.equal(409);
    expect(response.body.error).to.equal('BUSINESS_RULE_CONFLICT');
  });

  it('CT-003 deve bloquear characterName duplicado ignorando caixa', async () => {
    const payload = buildUser({ characterName: 'Goel' });

    await registerUser(payload);
    const response = await registerUser(
      buildUser({
        username: 'outro.user',
        characterName: 'goel'
      })
    );

    expect(response.status).to.equal(409);
    expect(response.body.error).to.equal('BUSINESS_RULE_CONFLICT');
  });

  it('CT-004 deve bloquear combinação inválida de raça, classe e função', async () => {
    const payload = buildUser({
      race: 'Orc',
      class: 'Bruxo',
      roleType: 'Tank'
    });

    const response = await registerUser(payload);

    expect(response.status).to.equal(409);
    expect(response.body.error).to.equal('BUSINESS_RULE_CONFLICT');
  });

  it('CT-005 deve realizar login com sucesso', async () => {
    const payload = buildUser();
    await registerUser(payload);

    const response = await request(app)
      .post('/auth/login')
      .send({ username: payload.username, password: payload.password });

    expect(response.status).to.equal(200);
    expect(response.body.accessToken).to.be.a('string');
    expect(response.body.tokenType).to.equal('Bearer');
  });

  it('CT-006 deve rejeitar login com senha inválida', async () => {
    const payload = buildUser();
    await registerUser(payload);

    const response = await request(app)
      .post('/auth/login')
      .send({ username: payload.username, password: 'Senha@999' });

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('UNAUTHORIZED');
  });

  it('CT-007 deve aplicar rate limit no login', async () => {
    const payload = buildUser({ username: 'ratelimit.user' });
    const appComRateLimit = criarAplicacaoDeAutenticacaoComRateLimitAtivo();

    await registerUser(payload);

    let ultimaResposta;
    for (let tentativa = 0; tentativa < 11; tentativa += 1) {
      ultimaResposta = await request(appComRateLimit)
        .post('/auth/login')
        .send({ username: payload.username, password: 'Senha@999' });
    }

    expect(ultimaResposta.status).to.equal(429);
    expect(ultimaResposta.body.error).to.equal('RATE_LIMIT_EXCEEDED');
  });

  it('CT-046 deve garantir que respostas não exponham senha nem hash', async () => {
    const payload = buildUser();

    const cadastro = await registerUser(payload);
    const login = await request(app)
      .post('/auth/login')
      .send({ username: payload.username, password: payload.password });
    const erro = await request(app)
      .post('/auth/login')
      .send({ username: payload.username, password: 'Senha@999' });

    expect(cadastro.body).to.not.have.property('password');
    expect(cadastro.body).to.not.have.property('passwordHash');
    expect(login.body).to.not.have.property('password');
    expect(login.body).to.not.have.property('passwordHash');
    expect(erro.body).to.not.have.property('password');
    expect(erro.body).to.not.have.property('passwordHash');
  });
});

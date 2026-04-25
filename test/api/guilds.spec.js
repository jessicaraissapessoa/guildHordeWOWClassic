const { expect } = require('chai');
const request = require('supertest');
const app = require('../../src/app');
const { buildGuildName, buildUser } = require('./helpers/factory');
const { authHeaderFor, registerUser } = require('./helpers/auth');
const {
  buscarGuildaPorNome,
  buscarUsuarioPorUsername,
  contarUsuariosVinculadosAGuilda
} = require('./helpers/state');

describe('Guildas da API', () => {
  it('CT-008 deve criar guilda com sucesso', async () => {
    const user = buildUser();
    const headers = await authHeaderFor(user);
    const guildName = buildGuildName();

    const response = await request(app)
      .post('/guilds')
      .set(headers)
      .send({ guildName });

    expect(response.status).to.equal(201);
    expect(response.body.guildName).to.equal(guildName);
    expect(response.body.leaderCharacterName).to.equal(user.characterName);

    const usuario = await buscarUsuarioPorUsername(user.username);
    expect(usuario.guildName).to.equal(guildName);
    expect(usuario.guildRank).to.equal('Leader');
  });

  it('CT-009 deve bloquear criação de guilda com nome duplicado ignorando caixa', async () => {
    const leaderA = buildUser({ username: 'leader.a' });
    const leaderB = buildUser({ username: 'leader.b', characterName: 'Liderb' });
    const headersA = await authHeaderFor(leaderA);
    const headersB = await authHeaderFor(leaderB);

    await request(app).post('/guilds').set(headersA).send({ guildName: 'UmaGuilda' });
    const response = await request(app)
      .post('/guilds')
      .set(headersB)
      .send({ guildName: 'umaguilda' });

    expect(response.status).to.equal(409);
    expect(response.body.error).to.equal('BUSINESS_RULE_CONFLICT');
  });

  it('CT-010 deve impedir criação de guilda por usuário já vinculado a uma guilda', async () => {
    const leader = buildUser();
    const headers = await authHeaderFor(leader);

    await request(app).post('/guilds').set(headers).send({ guildName: 'Primeira Guilda' });
    const response = await request(app)
      .post('/guilds')
      .set(headers)
      .send({ guildName: 'Segunda Guilda' });

    expect(response.status).to.equal(409);
    expect(response.body.error).to.equal('BUSINESS_RULE_CONFLICT');
  });

  it('CT-030 deve listar guildas com sucesso', async () => {
    const leader = buildUser();
    const headers = await authHeaderFor(leader);

    await request(app).post('/guilds').set(headers).send({ guildName: 'Lista Guilda' });

    const response = await request(app)
      .get('/guilds?page=1&pageSize=10&sortBy=createdAt&sortOrder=asc')
      .set(headers);

    expect(response.status).to.equal(200);
    expect(response.body.items).to.have.length(1);
    expect(response.body.items[0]).to.include({
      guildName: 'Lista Guilda',
      leaderCharacterName: leader.characterName,
      totalMembers: 1
    });
  });

  it('CT-031 deve validar paginação e ordenação de guildas', async () => {
    const leaderA = buildUser({ username: 'lista.a', characterName: 'Listaa' });
    const leaderB = buildUser({ username: 'lista.b', characterName: 'Listab' });
    const auditor = buildUser({ username: 'auditor.a', characterName: 'Audita' });
    const headersA = await authHeaderFor(leaderA);
    const headersB = await authHeaderFor(leaderB);
    const auditorHeaders = await authHeaderFor(auditor);

    await request(app).post('/guilds').set(headersA).send({ guildName: 'Zulu' });
    await request(app).post('/guilds').set(headersB).send({ guildName: 'Alpha' });

    const response = await request(app)
      .get('/guilds?page=2&pageSize=1&sortBy=guildName&sortOrder=asc')
      .set(auditorHeaders);

    expect(response.status).to.equal(200);
    expect(response.body.page).to.equal(2);
    expect(response.body.pageSize).to.equal(1);
    expect(response.body.total).to.equal(2);
    expect(response.body.items).to.have.length(1);
    expect(response.body.items[0].guildName).to.equal('Zulu');
  });

  it('CT-032 deve deletar guilda com sucesso', async () => {
    const leader = buildUser();
    const member = buildUser({ username: 'member.a', characterName: 'Membera' });
    const headers = await authHeaderFor(leader);

    await registerUser(member);
    await request(app).post('/guilds').set(headers).send({ guildName: 'Guilda Delete' });
    await request(app).post('/guilds/members').set(headers).send({ characterName: member.characterName });

    const response = await request(app)
      .delete('/guilds/me')
      .set(headers);

    expect(response.status).to.equal(204);

    const guilda = await buscarGuildaPorNome('Guilda Delete');
    const usuarioLider = await buscarUsuarioPorUsername(leader.username);
    const usuarioMembro = await buscarUsuarioPorUsername(member.username);

    expect(guilda).to.equal(null);
    expect(usuarioLider.guildId).to.equal(null);
    expect(usuarioLider.guildRank).to.equal(null);
    expect(usuarioMembro.guildId).to.equal(null);
    expect(usuarioMembro.guildRank).to.equal(null);
  });

  it('CT-033 deve impedir deleção de guilda com usuário que não é líder', async () => {
    const leader = buildUser({ username: 'guild.leader' });
    const member = buildUser({ username: 'guild.member', characterName: 'Guildmb' });
    const leaderHeaders = await authHeaderFor(leader);

    await registerUser(member);
    await request(app).post('/guilds').set(leaderHeaders).send({ guildName: 'Guilda Protegida' });
    await request(app)
      .post('/guilds/members')
      .set(leaderHeaders)
      .send({ characterName: member.characterName });

    const memberHeaders = await authHeaderFor(member);
    const response = await request(app)
      .delete('/guilds/me')
      .set(memberHeaders);

    expect(response.status).to.equal(403);
    expect(await contarUsuariosVinculadosAGuilda('Guilda Protegida')).to.equal(2);
  });

  it('CT-039 deve listar integrantes de guilda com busca case-insensitive', async () => {
    const leader = buildUser({ username: 'case.leader' });
    const member = buildUser({ username: 'case.member', characterName: 'Casemb' });
    const headers = await authHeaderFor(leader);

    await registerUser(member);
    await request(app).post('/guilds').set(headers).send({ guildName: 'UmaGuilda' });
    await request(app).post('/guilds/members').set(headers).send({ characterName: member.characterName });

    const response = await request(app)
      .get('/guilds/umaguilda/members')
      .set(headers);

    expect(response.status).to.equal(200);
    expect(response.body.guildName).to.equal('UmaGuilda');
    expect(response.body.members.map((item) => item.characterName)).to.include.members([
      leader.characterName,
      member.characterName
    ]);
  });
});

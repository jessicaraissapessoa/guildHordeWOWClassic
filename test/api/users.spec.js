const { expect } = require('chai');
const request = require('supertest');
const app = require('../../src/app');
const { buildUser } = require('./helpers/factory');
const { authHeaderFor, registerUser } = require('./helpers/auth');
const {
  buscarUsuarioPorUsername
} = require('./helpers/state');

describe('Usuários da API', () => {
  it('CT-035 deve alterar a própria função com sucesso', async () => {
    const user = buildUser({
      race: 'Troll',
      class: 'Sacerdote',
      roleType: 'Healer'
    });
    const headers = await authHeaderFor(user);

    const response = await request(app)
      .patch('/users/me/role-type')
      .set(headers)
      .send({ roleType: 'dps' });

    expect(response.status).to.equal(200);
    expect(response.body.roleType).to.equal('DPS');
  });

  it('CT-036 deve bloquear alteração da própria função para combinação inválida', async () => {
    const user = buildUser({
      race: 'Orc',
      class: 'Bruxo',
      roleType: 'DPS'
    });
    const headers = await authHeaderFor(user);

    const response = await request(app)
      .patch('/users/me/role-type')
      .set(headers)
      .send({ roleType: 'Tank' });

    expect(response.status).to.equal(409);
  });

  it('CT-037 deve listar usuários com filtros', async () => {
    const leader = buildUser({
      username: 'filtro.leader',
      characterName: 'Filtra',
      race: 'Orc',
      class: 'xama',
      roleType: 'DPS'
    });
    const target = buildUser({
      username: 'filtro.target',
      characterName: 'Filter',
      race: 'Orc',
      class: 'xamã',
      roleType: 'DPS'
    });
    const outro = buildUser({
      username: 'filtro.outro',
      characterName: 'Outros',
      race: 'Troll',
      class: 'Sacerdote',
      roleType: 'Healer'
    });
    const leaderHeaders = await authHeaderFor(leader);

    await registerUser(target);
    await registerUser(outro);
    await request(app).post('/guilds').set(leaderHeaders).send({ guildName: 'Guilda Filtro' });
    await request(app)
      .post('/guilds/members')
      .set(leaderHeaders)
      .send({ characterName: target.characterName });

    const response = await request(app)
      .get('/users?guildName=guilda filtro&class=xama&roleType=dps')
      .set(leaderHeaders);

    expect(response.status).to.equal(200);
    expect(response.body.items).to.have.length(2);
    expect(response.body.items.map((item) => item.username)).to.include.members([
      leader.username,
      target.username
    ]);
  });

  it('CT-038 deve validar paginação e ordenação de usuários', async () => {
    const auditor = buildUser({ username: 'pagina.auditor', characterName: 'Pagaud' });
    const userA = buildUser({ username: 'pagina.alpha', characterName: 'Alphaa' });
    const userB = buildUser({ username: 'pagina.beta', characterName: 'Betaaa' });
    const headers = await authHeaderFor(auditor);

    await registerUser(userA);
    await registerUser(userB);

    const response = await request(app)
      .get('/users?page=2&pageSize=1&sortBy=username&sortOrder=asc')
      .set(headers);

    expect(response.status).to.equal(200);
    expect(response.body.page).to.equal(2);
    expect(response.body.pageSize).to.equal(1);
    expect(response.body.total).to.equal(3);
    expect(response.body.items).to.have.length(1);
    expect(response.body.items[0].username).to.equal('pagina.auditor');
  });

  it('CT-040 deve deletar o próprio usuário não líder', async () => {
    const user = buildUser();
    const headers = await authHeaderFor(user);

    const response = await request(app)
      .delete('/users/me')
      .set(headers);

    expect(response.status).to.equal(204);
    expect(await buscarUsuarioPorUsername(user.username)).to.equal(null);
  });

  it('CT-041 deve impedir deleção do próprio usuário enquanto for líder', async () => {
    const user = buildUser();
    const headers = await authHeaderFor(user);
    await request(app).post('/guilds').set(headers).send({ guildName: 'Horda Lider' });

    const response = await request(app)
      .delete('/users/me')
      .set(headers);

    expect(response.status).to.equal(409);
  });

  it('CT-047 deve aceitar enums com e sem acentuação na consulta de usuários', async () => {
    const leader = buildUser({
      username: 'enum.leader',
      characterName: 'Enumld',
      race: 'Orc',
      class: 'xama',
      roleType: 'DPS'
    });
    const member = buildUser({
      username: 'enum.member',
      characterName: 'Enummb',
      race: 'Orc',
      class: 'xamã',
      roleType: 'DPS'
    });
    const headers = await authHeaderFor(leader);

    await registerUser(member);
    await request(app).post('/guilds').set(headers).send({ guildName: 'Guilda Enum' });
    await request(app).post('/guilds/members').set(headers).send({ characterName: member.characterName });

    const response = await request(app)
      .get('/users?class=xamá&guildRank=lider')
      .set(headers);

    expect(response.status).to.equal(200);
    expect(response.body.items).to.have.length(1);
    expect(response.body.items[0].class).to.equal('Xamã');
    expect(response.body.items[0].guildRank).to.equal('Leader');
  });
});

const { expect } = require('chai');
const request = require('supertest');
const app = require('../../src/app');
const { buildUser } = require('./helpers/factory');
const { authHeaderFor, registerUser } = require('./helpers/auth');
const {
  buscarUsuarioPorNomeDePersonagem
} = require('./helpers/state');

describe('Integrantes de guilda da API', () => {
  it('CT-012 deve adicionar integrante sem guilda na própria guilda', async () => {
    const leader = buildUser();
    const target = buildUser({ username: 'member.add', characterName: 'Memberx' });
    const headers = await authHeaderFor(leader);

    await registerUser(target);
    const response = await request(app)
      .post('/guilds')
      .set(headers)
      .send({ guildName: 'Guilda Add' });

    expect(response.status).to.equal(201);

    const addResponse = await request(app)
      .post('/guilds/members')
      .set(headers)
      .send({ characterName: target.characterName });

    expect(addResponse.status).to.equal(201);
    expect(addResponse.body.guildRank).to.equal('Member');

    const alvoAtualizado = await buscarUsuarioPorNomeDePersonagem(target.characterName);
    expect(alvoAtualizado.guildName).to.equal('Guilda Add');
    expect(alvoAtualizado.guildRank).to.equal('Member');
  });

  it('CT-013 deve impedir membro de adicionar integrante', async () => {
    const leader = buildUser({ username: 'add.leader' });
    const memberActor = buildUser({ username: 'add.member', characterName: 'Memact' });
    const target = buildUser({ username: 'add.target', characterName: 'Memtar' });
    const leaderHeaders = await authHeaderFor(leader);

    await registerUser(memberActor);
    await registerUser(target);
    await request(app).post('/guilds').set(leaderHeaders).send({ guildName: 'Guilda Add Bloqueio' });
    await request(app).post('/guilds/members').set(leaderHeaders).send({ characterName: memberActor.characterName });

    const memberHeaders = await authHeaderFor(memberActor);
    const response = await request(app)
      .post('/guilds/members')
      .set(memberHeaders)
      .send({ characterName: target.characterName });

    expect(response.status).to.equal(403);
  });

  it('CT-014 deve impedir usuário sem guilda de adicionar integrante', async () => {
    const actor = buildUser({ username: 'noguild.actor' });
    const target = buildUser({ username: 'noguild.target', characterName: 'Ngtarg' });
    const headers = await authHeaderFor(actor);

    await registerUser(target);
    const response = await request(app)
      .post('/guilds/members')
      .set(headers)
      .send({ characterName: target.characterName });

    expect(response.status).to.equal(403);
  });

  it('CT-015 deve impedir adicionar usuário que já pertence a uma guilda', async () => {
    const leaderA = buildUser({ username: 'leader.add.a' });
    const leaderB = buildUser({ username: 'leader.add.b', characterName: 'Leadbb' });
    const target = buildUser({ username: 'target.in.guild', characterName: 'Targld' });
    const headersA = await authHeaderFor(leaderA);
    const headersB = await authHeaderFor(leaderB);

    await registerUser(target);
    await request(app).post('/guilds').set(headersA).send({ guildName: 'Guilda A' });
    await request(app).post('/guilds').set(headersB).send({ guildName: 'Guilda B' });
    await request(app).post('/guilds/members').set(headersA).send({ characterName: target.characterName });

    const response = await request(app)
      .post('/guilds/members')
      .set(headersB)
      .send({ characterName: target.characterName });

    expect(response.status).to.equal(409);
  });

  it('CT-017 deve transferir liderança com sucesso', async () => {
    const leader = buildUser({ username: 'rank.leader' });
    const member = buildUser({ username: 'rank.member', characterName: 'Rankmb' });
    const headers = await authHeaderFor(leader);

    await registerUser(member);
    await request(app).post('/guilds').set(headers).send({ guildName: 'Guilda Rank' });
    await request(app).post('/guilds/members').set(headers).send({ characterName: member.characterName });

    const response = await request(app)
      .patch(`/guilds/members/${member.characterName}/rank`)
      .set(headers)
      .send({ guildRank: 'líder' });

    expect(response.status).to.equal(200);
    expect(response.body.guildRank).to.equal('Leader');

    const liderAnterior = await buscarUsuarioPorNomeDePersonagem(leader.characterName);
    const novoLider = await buscarUsuarioPorNomeDePersonagem(member.characterName);
    expect(liderAnterior.guildRank).to.equal('Member');
    expect(novoLider.guildRank).to.equal('Leader');
  });

  it('CT-018 deve impedir oficial de alterar cargo', async () => {
    const leader = buildUser({ username: 'officer.leader' });
    const officer = buildUser({ username: 'officer.actor', characterName: 'Offact' });
    const target = buildUser({ username: 'officer.target', characterName: 'Offtar' });
    const leaderHeaders = await authHeaderFor(leader);

    await registerUser(officer);
    await registerUser(target);
    await request(app).post('/guilds').set(leaderHeaders).send({ guildName: 'Guilda Oficiais' });
    await request(app).post('/guilds/members').set(leaderHeaders).send({ characterName: officer.characterName });
    await request(app).post('/guilds/members').set(leaderHeaders).send({ characterName: target.characterName });
    await request(app)
      .patch(`/guilds/members/${officer.characterName}/rank`)
      .set(leaderHeaders)
      .send({ guildRank: 'Oficial' });

    const officerHeaders = await authHeaderFor(officer);
    const response = await request(app)
      .patch(`/guilds/members/${target.characterName}/rank`)
      .set(officerHeaders)
      .send({ guildRank: 'Oficial' });

    expect(response.status).to.equal(403);
  });

  it('CT-019 deve impedir alterar cargo de integrante de outra guilda', async () => {
    const leaderA = buildUser({ username: 'guilda.a', characterName: 'Guildaa' });
    const leaderB = buildUser({ username: 'guilda.b', characterName: 'Guildab' });
    const memberB = buildUser({ username: 'member.b', characterName: 'Memgub' });
    const headersA = await authHeaderFor(leaderA);
    const headersB = await authHeaderFor(leaderB);

    await registerUser(memberB);
    await request(app).post('/guilds').set(headersA).send({ guildName: 'Guilda Alfa' });
    await request(app).post('/guilds').set(headersB).send({ guildName: 'Guilda Beta' });
    await request(app).post('/guilds/members').set(headersB).send({ characterName: memberB.characterName });

    const response = await request(app)
      .patch(`/guilds/members/${memberB.characterName}/rank`)
      .set(headersA)
      .send({ guildRank: 'Oficial' });

    expect(response.status).to.equal(403);
  });

  it('CT-021 deve permitir líder remover oficial', async () => {
    const leader = buildUser({ username: 'remove.leader' });
    const officer = buildUser({ username: 'remove.officer', characterName: 'Rmofic' });
    const headers = await authHeaderFor(leader);

    await registerUser(officer);
    await request(app).post('/guilds').set(headers).send({ guildName: 'Guilda Remocao' });
    await request(app).post('/guilds/members').set(headers).send({ characterName: officer.characterName });
    await request(app)
      .patch(`/guilds/members/${officer.characterName}/rank`)
      .set(headers)
      .send({ guildRank: 'Oficial' });

    const response = await request(app)
      .delete(`/guilds/members/${officer.characterName}`)
      .set(headers);

    expect(response.status).to.equal(204);
    const oficialAtualizado = await buscarUsuarioPorNomeDePersonagem(officer.characterName);
    expect(oficialAtualizado.guildId).to.equal(null);
    expect(oficialAtualizado.guildRank).to.equal(null);
  });

  it('CT-022 deve impedir oficial de remover outro oficial', async () => {
    const leader = buildUser({ username: 'rm.leader' });
    const officerA = buildUser({ username: 'rm.off.a', characterName: 'Rmofca' });
    const officerB = buildUser({ username: 'rm.off.b', characterName: 'Rmofcb' });
    const leaderHeaders = await authHeaderFor(leader);

    await registerUser(officerA);
    await registerUser(officerB);
    await request(app).post('/guilds').set(leaderHeaders).send({ guildName: 'Guilda Remover' });
    await request(app).post('/guilds/members').set(leaderHeaders).send({ characterName: officerA.characterName });
    await request(app).post('/guilds/members').set(leaderHeaders).send({ characterName: officerB.characterName });
    await request(app).patch(`/guilds/members/${officerA.characterName}/rank`).set(leaderHeaders).send({ guildRank: 'Oficial' });
    await request(app).patch(`/guilds/members/${officerB.characterName}/rank`).set(leaderHeaders).send({ guildRank: 'Oficial' });

    const officerHeaders = await authHeaderFor(officerA);
    const response = await request(app)
      .delete(`/guilds/members/${officerB.characterName}`)
      .set(officerHeaders);

    expect(response.status).to.equal(403);
  });

  it('CT-023 deve impedir líder de remover a si mesmo', async () => {
    const leader = buildUser();
    const headers = await authHeaderFor(leader);

    await request(app).post('/guilds').set(headers).send({ guildName: 'Guilda Auto' });
    const response = await request(app)
      .delete(`/guilds/members/${leader.characterName}`)
      .set(headers);

    expect(response.status).to.equal(409);
  });

  it('CT-024 deve impedir membro de remover outro integrante', async () => {
    const leader = buildUser({ username: 'membro.leader' });
    const memberA = buildUser({ username: 'membro.a', characterName: 'Memrma' });
    const memberB = buildUser({ username: 'membro.b', characterName: 'Memrmb' });
    const leaderHeaders = await authHeaderFor(leader);

    await registerUser(memberA);
    await registerUser(memberB);
    await request(app).post('/guilds').set(leaderHeaders).send({ guildName: 'Guilda Membros' });
    await request(app).post('/guilds/members').set(leaderHeaders).send({ characterName: memberA.characterName });
    await request(app).post('/guilds/members').set(leaderHeaders).send({ characterName: memberB.characterName });

    const memberHeaders = await authHeaderFor(memberA);
    const response = await request(app)
      .delete(`/guilds/members/${memberB.characterName}`)
      .set(memberHeaders);

    expect(response.status).to.equal(403);
  });

  it('CT-025 deve impedir usuário sem guilda de remover integrante', async () => {
    const actor = buildUser({ username: 'sem.guilda.actor' });
    const leader = buildUser({ username: 'sem.guilda.leader', characterName: 'Semgld' });
    const target = buildUser({ username: 'sem.guilda.target', characterName: 'Semgtt' });
    const actorHeaders = await authHeaderFor(actor);
    const leaderHeaders = await authHeaderFor(leader);

    await registerUser(target);
    await request(app).post('/guilds').set(leaderHeaders).send({ guildName: 'Guilda Remota' });
    await request(app).post('/guilds/members').set(leaderHeaders).send({ characterName: target.characterName });

    const response = await request(app)
      .delete(`/guilds/members/${target.characterName}`)
      .set(actorHeaders);

    expect(response.status).to.equal(403);
  });

  it('CT-027 deve permitir membro sair da guilda', async () => {
    const leader = buildUser({ username: 'leave.leader' });
    const member = buildUser({ username: 'leave.member', characterName: 'Leavee' });
    const leaderHeaders = await authHeaderFor(leader);

    await registerUser(member);
    await request(app).post('/guilds').set(leaderHeaders).send({ guildName: 'Guilda Leave' });
    await request(app).post('/guilds/members').set(leaderHeaders).send({ characterName: member.characterName });

    const memberHeaders = await authHeaderFor(member);
    const response = await request(app)
      .post('/guilds/me/leave')
      .set(memberHeaders);

    expect(response.status).to.equal(204);
    const membroAtualizado = await buscarUsuarioPorNomeDePersonagem(member.characterName);
    expect(membroAtualizado.guildId).to.equal(null);
    expect(membroAtualizado.guildRank).to.equal(null);
  });

  it('CT-028 deve impedir líder de sair da guilda sem transferir liderança', async () => {
    const leader = buildUser();
    const headers = await authHeaderFor(leader);

    await request(app).post('/guilds').set(headers).send({ guildName: 'Guilda Lider' });
    const response = await request(app)
      .post('/guilds/me/leave')
      .set(headers);

    expect(response.status).to.equal(409);
  });

  it('CT-029 deve impedir saída da guilda por usuário sem guilda', async () => {
    const user = buildUser();
    const headers = await authHeaderFor(user);

    const response = await request(app)
      .post('/guilds/me/leave')
      .set(headers);

    expect(response.status).to.equal(403);
  });

  it('CT-047 deve aceitar enums com e sem acentuação na entrada', async () => {
    const leader = buildUser({ username: 'accent.leader', class: 'xama' });
    const member = buildUser({ username: 'accent.member', characterName: 'Accent' });
    const leaderHeaders = await authHeaderFor(leader);

    await registerUser(member);
    await request(app).post('/guilds').set(leaderHeaders).send({ guildName: 'Guilda Accent' });
    await request(app).post('/guilds/members').set(leaderHeaders).send({ characterName: member.characterName });

    const rankResponse = await request(app)
      .patch(`/guilds/members/${member.characterName}/rank`)
      .set(leaderHeaders)
      .send({ guildRank: 'lider' });

    expect(rankResponse.status).to.equal(200);
    expect(rankResponse.body.guildRank).to.equal('Leader');
  });
});

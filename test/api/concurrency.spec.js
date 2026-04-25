const { expect } = require('chai');
const request = require('supertest');
const app = require('../../src/app');
const { buildUser } = require('./helpers/factory');
const { authHeaderFor, registerUser } = require('./helpers/auth');
const {
  buscarGuildaPorNome,
  buscarUsuarioPorNomeDePersonagem,
  listarIntegrantesDaGuilda,
  contarGuildasPorNome,
  contarUsuariosVinculadosAGuilda
} = require('./helpers/state');

describe('Concorrência da API', () => {
  it('CT-011 deve garantir consistência em criação concorrente da mesma guilda', async () => {
    const leaderA = buildUser({ username: 'conc.guild.a' });
    const leaderB = buildUser({ username: 'conc.guild.b', characterName: 'Congbb' });
    const headersA = await authHeaderFor(leaderA);
    const headersB = await authHeaderFor(leaderB);

    const [responseA, responseB] = await Promise.all([
      request(app).post('/guilds').set(headersA).send({ guildName: 'Guilda Concorrente' }),
      request(app).post('/guilds').set(headersB).send({ guildName: 'Guilda Concorrente' })
    ]);

    const statuses = [responseA.status, responseB.status].sort();
    expect(statuses).to.deep.equal([201, 409]);
    expect(await contarGuildasPorNome('Guilda Concorrente')).to.equal(1);
  });

  it('CT-016 deve garantir consistência em cadastro concorrente do mesmo integrante', async () => {
    const leaderA = buildUser({ username: 'conc.add.a' });
    const leaderB = buildUser({ username: 'conc.add.b', characterName: 'Conadb' });
    const target = buildUser({ username: 'conc.add.target', characterName: 'Conadt' });
    const headersA = await authHeaderFor(leaderA);
    const headersB = await authHeaderFor(leaderB);

    await registerUser(target);
    await request(app).post('/guilds').set(headersA).send({ guildName: 'Guilda Um' });
    await request(app).post('/guilds').set(headersB).send({ guildName: 'Guilda Dois' });

    const [responseA, responseB] = await Promise.all([
      request(app).post('/guilds/members').set(headersA).send({ characterName: target.characterName }),
      request(app).post('/guilds/members').set(headersB).send({ characterName: target.characterName })
    ]);

    const statuses = [responseA.status, responseB.status].sort();
    expect(statuses).to.deep.equal([201, 409]);

    const alvoFinal = await buscarUsuarioPorNomeDePersonagem(target.characterName);
    expect(['Guilda Um', 'Guilda Dois']).to.include(alvoFinal.guildName);
    expect(alvoFinal.guildRank).to.equal('Member');
  });

  it('CT-020 deve garantir consistência em transferência concorrente de liderança', async () => {
    const leader = buildUser({ username: 'conc.rank.leader' });
    const memberA = buildUser({ username: 'conc.rank.a', characterName: 'Conrka' });
    const memberB = buildUser({ username: 'conc.rank.b', characterName: 'Conrkb' });
    const headers = await authHeaderFor(leader);

    await registerUser(memberA);
    await registerUser(memberB);
    await request(app).post('/guilds').set(headers).send({ guildName: 'Guilda Lideranca' });
    await request(app).post('/guilds/members').set(headers).send({ characterName: memberA.characterName });
    await request(app).post('/guilds/members').set(headers).send({ characterName: memberB.characterName });

    const [responseA, responseB] = await Promise.all([
      request(app)
        .patch(`/guilds/members/${memberA.characterName}/rank`)
        .set(headers)
        .send({ guildRank: 'Leader' }),
      request(app)
        .patch(`/guilds/members/${memberB.characterName}/rank`)
        .set(headers)
        .send({ guildRank: 'Leader' })
    ]);

    expect([responseA.status, responseB.status]).to.include(200);

    const integrantes = await listarIntegrantesDaGuilda('Guilda Lideranca');
    const lideres = integrantes.filter((item) => item.guildRank === 'Leader');
    expect(lideres).to.have.length(1);
  });

  it('CT-026 deve garantir consistência em remoção concorrente e alteração de cargo', async () => {
    const leader = buildUser({ username: 'conc.remove.leader' });
    const target = buildUser({ username: 'conc.remove.target', characterName: 'Conrmt' });
    const headers = await authHeaderFor(leader);

    await registerUser(target);
    await request(app).post('/guilds').set(headers).send({ guildName: 'Guilda Remocao Conc' });
    await request(app).post('/guilds/members').set(headers).send({ characterName: target.characterName });

    const [responseDelete, responsePatch] = await Promise.all([
      request(app).delete(`/guilds/members/${target.characterName}`).set(headers),
      request(app)
        .patch(`/guilds/members/${target.characterName}/rank`)
        .set(headers)
        .send({ guildRank: 'Oficial' })
    ]);

    expect([responseDelete.status, responsePatch.status]).to.include(204);
    expect([200, 403, 404]).to.include(responsePatch.status);

    const alvoFinal = await buscarUsuarioPorNomeDePersonagem(target.characterName);
    expect(alvoFinal.guildId).to.equal(null);
    expect(alvoFinal.guildRank).to.equal(null);
  });

  it('CT-034 deve garantir consistência em deleção concorrente da guilda', async () => {
    const leader = buildUser({ username: 'conc.delete.leader' });
    const member = buildUser({ username: 'conc.delete.member', characterName: 'Condel' });
    const headers = await authHeaderFor(leader);

    await registerUser(member);
    await request(app).post('/guilds').set(headers).send({ guildName: 'Guilda Delete Conc' });
    await request(app).post('/guilds/members').set(headers).send({ characterName: member.characterName });

    const [responseA, responseB] = await Promise.all([
      request(app).delete('/guilds/me').set(headers),
      request(app).delete('/guilds/me').set(headers)
    ]);

    expect([responseA.status, responseB.status]).to.include(204);
    expect([responseA.status, responseB.status]).to.include(403);
    expect(await buscarGuildaPorNome('Guilda Delete Conc')).to.equal(null);
    expect(await contarUsuariosVinculadosAGuilda('Guilda Delete Conc')).to.equal(0);
  });
});

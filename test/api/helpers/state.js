const { pool } = require('../../../src/db/pool');
const { normalizeCaseInsensitive } = require('../../../src/utils/normalization');

async function buscarUsuarioPorUsername(username) {
  const [rows] = await pool.execute(
    `SELECT
      u.id,
      u.username,
      u.password_hash AS passwordHash,
      u.character_name AS characterName,
      u.race,
      u.class AS className,
      u.role_type AS roleType,
      u.guild_id AS guildId,
      u.guild_rank AS guildRank,
      g.guild_name AS guildName
     FROM users u
     LEFT JOIN guilds g ON g.id = u.guild_id
     WHERE u.username_normalized = ?`,
    [normalizeCaseInsensitive(username)]
  );

  return rows[0] || null;
}

async function buscarUsuarioPorNomeDePersonagem(characterName) {
  const [rows] = await pool.execute(
    `SELECT
      u.id,
      u.username,
      u.password_hash AS passwordHash,
      u.character_name AS characterName,
      u.race,
      u.class AS className,
      u.role_type AS roleType,
      u.guild_id AS guildId,
      u.guild_rank AS guildRank,
      g.guild_name AS guildName
     FROM users u
     LEFT JOIN guilds g ON g.id = u.guild_id
     WHERE u.character_name_normalized = ?`,
    [normalizeCaseInsensitive(characterName)]
  );

  return rows[0] || null;
}

async function buscarGuildaPorNome(guildName) {
  const [rows] = await pool.execute(
    `SELECT
      id,
      guild_name AS guildName,
      guild_name_normalized AS guildNameNormalized
     FROM guilds
     WHERE guild_name_normalized = ?`,
    [normalizeCaseInsensitive(guildName)]
  );

  return rows[0] || null;
}

async function contarGuildasPorNome(guildName) {
  const [rows] = await pool.execute(
    'SELECT COUNT(*) AS total FROM guilds WHERE guild_name_normalized = ?',
    [normalizeCaseInsensitive(guildName)]
  );

  return Number(rows[0].total);
}

async function listarIntegrantesDaGuilda(guildName) {
  const [rows] = await pool.execute(
    `SELECT
      u.username,
      u.character_name AS characterName,
      u.guild_rank AS guildRank,
      g.guild_name AS guildName
     FROM users u
     INNER JOIN guilds g ON g.id = u.guild_id
     WHERE g.guild_name_normalized = ?
     ORDER BY u.character_name ASC`,
    [normalizeCaseInsensitive(guildName)]
  );

  return rows;
}

async function contarUsuariosVinculadosAGuilda(guildName) {
  const [rows] = await pool.execute(
    `SELECT COUNT(*) AS total
     FROM users u
     INNER JOIN guilds g ON g.id = u.guild_id
     WHERE g.guild_name_normalized = ?`,
    [normalizeCaseInsensitive(guildName)]
  );

  return Number(rows[0].total);
}

module.exports = {
  buscarUsuarioPorUsername,
  buscarUsuarioPorNomeDePersonagem,
  buscarGuildaPorNome,
  contarGuildasPorNome,
  listarIntegrantesDaGuilda,
  contarUsuariosVinculadosAGuilda
};

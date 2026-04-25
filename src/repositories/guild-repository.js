async function createGuild(executor, guild) {
  const [result] = await executor.execute(
    `INSERT INTO guilds (guild_name, guild_name_normalized)
     VALUES (?, ?)`,
    [guild.guildName, guild.guildNameNormalized]
  );

  return result.insertId;
}

async function listGuilds(executor, options) {
  const orderByMap = {
    guildName: 'g.guild_name_normalized',
    leaderCharacterName: 'leader.character_name_normalized',
    totalMembers: 'totalMembers',
    createdAt: 'g.created_at'
  };
  const offset = (options.page - 1) * options.pageSize;

  const [countRows] = await executor.execute(
    `SELECT COUNT(*) AS total
     FROM guilds`
  );

  const [rows] = await executor.query(
    `SELECT
      g.id,
      g.guild_name AS guildName,
      leader.character_name AS leaderCharacterName,
      COUNT(u.id) AS totalMembers,
      g.created_at AS createdAt,
      g.updated_at AS updatedAt
     FROM guilds g
     LEFT JOIN users u ON u.guild_id = g.id
     LEFT JOIN users leader
       ON leader.guild_id = g.id
      AND leader.guild_rank = 'Leader'
     GROUP BY g.id, g.guild_name, leader.character_name, leader.character_name_normalized, g.created_at, g.updated_at
     ORDER BY ${orderByMap[options.sortBy]} ${options.sortOrder.toUpperCase()}
     LIMIT ?, ?`,
    [offset, options.pageSize]
  );

  return {
    total: Number(countRows[0].total),
    items: rows.map((row) => ({
      ...row,
      totalMembers: Number(row.totalMembers)
    }))
  };
}

async function findGuildByNameNormalized(executor, guildNameNormalized, lock = false) {
  const query = `
    SELECT
      id,
      guild_name AS guildName,
      guild_name_normalized AS guildNameNormalized,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM guilds
    WHERE guild_name_normalized = ?
    ${lock ? 'FOR UPDATE' : ''}
  `;
  const [rows] = await executor.execute(query, [guildNameNormalized]);
  return rows[0] || null;
}

async function findGuildById(executor, guildId, lock = false) {
  const query = `
    SELECT
      id,
      guild_name AS guildName,
      guild_name_normalized AS guildNameNormalized,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM guilds
    WHERE id = ?
    ${lock ? 'FOR UPDATE' : ''}
  `;
  const [rows] = await executor.execute(query, [guildId]);
  return rows[0] || null;
}

async function deleteGuildById(executor, guildId) {
  await executor.execute('DELETE FROM guilds WHERE id = ?', [guildId]);
}

async function listGuildMembers(executor, guildId) {
  const [rows] = await executor.execute(
    `SELECT
      u.character_name AS characterName,
      g.guild_name AS guildName,
      u.guild_rank AS guildRank,
      u.race,
      u.class AS className,
      u.role_type AS roleType
     FROM users u
     INNER JOIN guilds g ON g.id = u.guild_id
     WHERE u.guild_id = ?
     ORDER BY
       CASE u.guild_rank
         WHEN 'Leader' THEN 3
         WHEN 'Officer' THEN 2
         ELSE 1
       END DESC,
       u.character_name ASC`,
    [guildId]
  );

  return rows;
}

module.exports = {
  createGuild,
  listGuilds,
  findGuildByNameNormalized,
  findGuildById,
  deleteGuildById,
  listGuildMembers
};

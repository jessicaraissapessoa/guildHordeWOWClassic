async function createUser(executor, user) {
  const [result] = await executor.execute(
    `INSERT INTO users
      (username, username_normalized, password_hash, character_name, character_name_normalized, race, class, role_type, guild_id, guild_rank)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user.username,
      user.usernameNormalized,
      user.passwordHash,
      user.characterName,
      user.characterNameNormalized,
      user.race,
      user.className,
      user.roleType,
      user.guildId || null,
      user.guildRank || null
    ]
  );

  return result.insertId;
}

async function findUserByUsernameNormalized(executor, usernameNormalized, lock = false) {
  const query = `
    SELECT
      u.id,
      u.username,
      u.username_normalized AS usernameNormalized,
      u.password_hash AS passwordHash,
      u.character_name AS characterName,
      u.character_name_normalized AS characterNameNormalized,
      u.race,
      u.class AS className,
      u.role_type AS roleType,
      u.guild_id AS guildId,
      u.guild_rank AS guildRank,
      g.guild_name AS guildName,
      g.guild_name_normalized AS guildNameNormalized,
      u.created_at AS createdAt,
      u.updated_at AS updatedAt
    FROM users u
    LEFT JOIN guilds g ON g.id = u.guild_id
    WHERE u.username_normalized = ?
    ${lock ? 'FOR UPDATE' : ''}
  `;
  const [rows] = await executor.execute(query, [usernameNormalized]);
  return rows[0] || null;
}

async function findUserByCharacterNameNormalized(executor, characterNameNormalized, lock = false) {
  const query = `
    SELECT
      u.id,
      u.username,
      u.username_normalized AS usernameNormalized,
      u.password_hash AS passwordHash,
      u.character_name AS characterName,
      u.character_name_normalized AS characterNameNormalized,
      u.race,
      u.class AS className,
      u.role_type AS roleType,
      u.guild_id AS guildId,
      u.guild_rank AS guildRank,
      g.guild_name AS guildName,
      g.guild_name_normalized AS guildNameNormalized,
      u.created_at AS createdAt,
      u.updated_at AS updatedAt
    FROM users u
    LEFT JOIN guilds g ON g.id = u.guild_id
    WHERE u.character_name_normalized = ?
    ${lock ? 'FOR UPDATE' : ''}
  `;
  const [rows] = await executor.execute(query, [characterNameNormalized]);
  return rows[0] || null;
}

async function findUserById(executor, userId, lock = false) {
  const query = `
    SELECT
      u.id,
      u.username,
      u.username_normalized AS usernameNormalized,
      u.password_hash AS passwordHash,
      u.character_name AS characterName,
      u.character_name_normalized AS characterNameNormalized,
      u.race,
      u.class AS className,
      u.role_type AS roleType,
      u.guild_id AS guildId,
      u.guild_rank AS guildRank,
      g.guild_name AS guildName,
      g.guild_name_normalized AS guildNameNormalized,
      u.created_at AS createdAt,
      u.updated_at AS updatedAt
    FROM users u
    LEFT JOIN guilds g ON g.id = u.guild_id
    WHERE u.id = ?
    ${lock ? 'FOR UPDATE' : ''}
  `;
  const [rows] = await executor.execute(query, [userId]);
  return rows[0] || null;
}

async function updateUserGuild(executor, userId, guildId, guildRank) {
  await executor.execute(
    `UPDATE users
     SET guild_id = ?, guild_rank = ?
     WHERE id = ?`,
    [guildId, guildRank, userId]
  );
}

async function updateUserRoleType(executor, userId, roleType) {
  await executor.execute(
    `UPDATE users
     SET role_type = ?
     WHERE id = ?`,
    [roleType, userId]
  );
}

async function updateGuildRank(executor, userId, guildRank) {
  await executor.execute(
    `UPDATE users
     SET guild_rank = ?
     WHERE id = ?`,
    [guildRank, userId]
  );
}

async function clearGuildByGuildId(executor, guildId) {
  await executor.execute(
    `UPDATE users
     SET guild_id = NULL, guild_rank = NULL
     WHERE guild_id = ?`,
    [guildId]
  );
}

async function deleteUserById(executor, userId) {
  await executor.execute('DELETE FROM users WHERE id = ?', [userId]);
}

async function listUsers(executor, options) {
  const conditions = [];
  const values = [];

  if (options.usernameNormalized) {
    conditions.push('u.username_normalized = ?');
    values.push(options.usernameNormalized);
  }
  if (options.characterNameNormalized) {
    conditions.push('u.character_name_normalized = ?');
    values.push(options.characterNameNormalized);
  }
  if (options.guildNameNormalized) {
    conditions.push('g.guild_name_normalized = ?');
    values.push(options.guildNameNormalized);
  }
  if (options.guildRank) {
    conditions.push('u.guild_rank = ?');
    values.push(options.guildRank);
  }
  if (options.race) {
    conditions.push('u.race = ?');
    values.push(options.race);
  }
  if (options.className) {
    conditions.push('u.class = ?');
    values.push(options.className);
  }
  if (options.roleType) {
    conditions.push('u.role_type = ?');
    values.push(options.roleType);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const orderByMap = {
    username: 'u.username_normalized',
    characterName: 'u.character_name_normalized',
    guildName: 'g.guild_name_normalized',
    guildRank: 'u.guild_rank',
    race: 'u.race',
    class: 'u.class',
    roleType: 'u.role_type',
    createdAt: 'u.created_at'
  };

  const [countRows] = await executor.execute(
    `SELECT COUNT(*) AS total
     FROM users u
     LEFT JOIN guilds g ON g.id = u.guild_id
     ${whereClause}`,
    values
  );

  const offset = (options.page - 1) * options.pageSize;
  const [rows] = await executor.query(
    `SELECT
      u.id,
      u.username,
      u.character_name AS characterName,
      g.guild_name AS guildName,
      u.guild_rank AS guildRank,
      u.race,
      u.class AS className,
      u.role_type AS roleType,
      u.created_at AS createdAt,
      u.updated_at AS updatedAt
     FROM users u
     LEFT JOIN guilds g ON g.id = u.guild_id
     ${whereClause}
     ORDER BY ${orderByMap[options.sortBy]} ${options.sortOrder.toUpperCase()}
     LIMIT ?, ?`,
    [...values, offset, options.pageSize]
  );

  return {
    total: Number(countRows[0].total),
    items: rows
  };
}

module.exports = {
  createUser,
  findUserByUsernameNormalized,
  findUserByCharacterNameNormalized,
  findUserById,
  updateUserGuild,
  updateUserRoleType,
  updateGuildRank,
  clearGuildByGuildId,
  deleteUserById,
  listUsers
};

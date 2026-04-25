const { pool, withTransaction } = require('../db/pool');
const AppError = require('../errors/AppError');
const guildRepository = require('../repositories/guild-repository');
const userRepository = require('../repositories/user-repository');
const { requireAuthenticatedUser } = require('./user-service');
const {
  assertGuildName,
  assertCharacterName,
  canonicalizeGuildRank,
  canonicalizeClass,
  normalizeGuildName,
  normalizeCharacterName,
  canManageRank
} = require('../utils/validators');

function toGuildResponse(guild, leaderCharacterName) {
  return {
    id: guild.id,
    guildName: guild.guildName,
    leaderCharacterName,
    createdAt: guild.createdAt,
    updatedAt: guild.updatedAt
  };
}

function assertUserIsInGuild(user) {
  if (!user.guildId) {
    throw new AppError(403, 'FORBIDDEN', 'Authenticated user does not have permission for this operation.');
  }
}

async function listGuilds(query) {
  const page = query.page ? Number(query.page) : 1;
  const pageSize = query.pageSize ? Number(query.pageSize) : 20;
  const sortBy = query.sortBy || 'createdAt';
  const sortOrder = (query.sortOrder || 'asc').toLowerCase();
  const allowedSortBy = new Set(['guildName', 'leaderCharacterName', 'totalMembers', 'createdAt']);

  if (!Number.isInteger(page) || page < 1) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Request query is invalid.', [
      { field: 'page', message: 'page must be an integer greater than or equal to 1.' }
    ]);
  }

  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Request query is invalid.', [
      { field: 'pageSize', message: 'pageSize must be an integer between 1 and 100.' }
    ]);
  }

  if (!allowedSortBy.has(sortBy)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Request query is invalid.', [
      { field: 'sortBy', message: 'sortBy has an invalid value.' }
    ]);
  }

  if (!['asc', 'desc'].includes(sortOrder)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Request query is invalid.', [
      { field: 'sortOrder', message: 'sortOrder must be asc or desc.' }
    ]);
  }

  const result = await guildRepository.listGuilds(pool, {
    page,
    pageSize,
    sortBy,
    sortOrder
  });

  return {
    page,
    pageSize,
    total: result.total,
    totalPages: Math.ceil(result.total / pageSize),
    items: result.items
  };
}

async function createGuild(authUserId, payload) {
  return withTransaction(async (connection) => {
    const actor = await requireAuthenticatedUser(authUserId, connection, true);
    const guildName = assertGuildName(payload.guildName);
    const guildNameNormalized = normalizeGuildName(guildName);

    if (actor.guildId) {
      throw new AppError(409, 'BUSINESS_RULE_CONFLICT', 'Operation violates a business rule.', [
        { field: 'guildName', message: 'user already belongs to a guild.' }
      ]);
    }

    const existingGuild = await guildRepository.findGuildByNameNormalized(
      connection,
      guildNameNormalized,
      true
    );
    if (existingGuild) {
      throw new AppError(409, 'BUSINESS_RULE_CONFLICT', 'Operation violates a business rule.', [
        { field: 'guildName', message: 'guildName is already in use.' }
      ]);
    }

    const guildId = await guildRepository.createGuild(connection, {
      guildName,
      guildNameNormalized
    });
    await userRepository.updateUserGuild(connection, actor.id, guildId, 'Leader');

    const guild = await guildRepository.findGuildById(connection, guildId);
    return toGuildResponse(guild, actor.characterName);
  });
}

async function deleteOwnGuild(authUserId) {
  return withTransaction(async (connection) => {
    const actor = await requireAuthenticatedUser(authUserId, connection, true);

    assertUserIsInGuild(actor);
    if (actor.guildRank !== 'Leader') {
      throw new AppError(403, 'FORBIDDEN', 'Authenticated user does not have permission for this operation.');
    }

    await guildRepository.findGuildById(connection, actor.guildId, true);
    await userRepository.clearGuildByGuildId(connection, actor.guildId);
    await guildRepository.deleteGuildById(connection, actor.guildId);
  });
}

async function listGuildMembers(guildName) {
  const normalized = normalizeGuildName(assertGuildName(guildName));
  const guild = await guildRepository.findGuildByNameNormalized(pool, normalized);

  if (!guild) {
    throw new AppError(404, 'NOT_FOUND', 'Resource not found.');
  }

  const members = await guildRepository.listGuildMembers(pool, guild.id);

  return {
    guildName: guild.guildName,
    members: members.map((member) => ({
      characterName: member.characterName,
      guildName: member.guildName,
      guildRank: member.guildRank,
      race: member.race,
      class: canonicalizeClass(member.className),
      roleType: member.roleType
    }))
  };
}

async function addGuildMember(authUserId, payload) {
  return withTransaction(async (connection) => {
    const actor = await requireAuthenticatedUser(authUserId, connection, true);
    const characterName = assertCharacterName(payload.characterName);
    const normalizedCharacterName = normalizeCharacterName(characterName);

    assertUserIsInGuild(actor);

    if (!['Leader', 'Officer'].includes(actor.guildRank)) {
      throw new AppError(403, 'FORBIDDEN', 'Authenticated user does not have permission for this operation.');
    }

    const target = await userRepository.findUserByCharacterNameNormalized(
      connection,
      normalizedCharacterName,
      true
    );

    if (!target) {
      throw new AppError(404, 'NOT_FOUND', 'Resource not found.');
    }

    if (target.guildId) {
      throw new AppError(409, 'BUSINESS_RULE_CONFLICT', 'Operation violates a business rule.', [
        { field: 'characterName', message: 'target user already belongs to a guild.' }
      ]);
    }

    await userRepository.updateUserGuild(connection, target.id, actor.guildId, 'Member');
    const updated = await userRepository.findUserById(connection, target.id);
    return {
      id: updated.id,
      username: updated.username,
      characterName: updated.characterName,
      guildName: updated.guildName || actor.guildName,
      guildRank: updated.guildRank,
      race: updated.race,
      class: canonicalizeClass(updated.className),
      roleType: updated.roleType,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt
    };
  });
}

async function updateGuildMemberRank(authUserId, characterName, payload) {
  return withTransaction(async (connection) => {
    const actor = await requireAuthenticatedUser(authUserId, connection, true);
    const target = await userRepository.findUserByCharacterNameNormalized(
      connection,
      normalizeCharacterName(assertCharacterName(characterName)),
      true
    );
    const guildRank = canonicalizeGuildRank(payload.guildRank);

    assertUserIsInGuild(actor);

    if (actor.guildRank !== 'Leader') {
      throw new AppError(403, 'FORBIDDEN', 'Authenticated user does not have permission for this operation.');
    }

    if (!target) {
      throw new AppError(404, 'NOT_FOUND', 'Resource not found.');
    }

    if (target.id === actor.id) {
      throw new AppError(409, 'BUSINESS_RULE_CONFLICT', 'Operation violates a business rule.', [
        { field: 'characterName', message: 'leader cannot change own rank through this endpoint.' }
      ]);
    }

    if (target.guildId !== actor.guildId) {
      throw new AppError(403, 'FORBIDDEN', 'Authenticated user does not have permission for this operation.');
    }

    if (guildRank === 'Leader') {
      await userRepository.updateGuildRank(connection, actor.id, 'Member');
      await userRepository.updateGuildRank(connection, target.id, 'Leader');
    } else {
      await userRepository.updateGuildRank(connection, target.id, guildRank);
    }

    const updated = await userRepository.findUserById(connection, target.id);
    return {
      id: updated.id,
      username: updated.username,
      characterName: updated.characterName,
      guildName: updated.guildName,
      guildRank: updated.guildRank,
      race: updated.race,
      class: canonicalizeClass(updated.className),
      roleType: updated.roleType,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt
    };
  });
}

async function removeGuildMember(authUserId, characterName) {
  return withTransaction(async (connection) => {
    const actor = await requireAuthenticatedUser(authUserId, connection, true);
    const target = await userRepository.findUserByCharacterNameNormalized(
      connection,
      normalizeCharacterName(assertCharacterName(characterName)),
      true
    );

    assertUserIsInGuild(actor);

    if (!target) {
      throw new AppError(404, 'NOT_FOUND', 'Resource not found.');
    }

    if (target.id === actor.id) {
      throw new AppError(409, 'BUSINESS_RULE_CONFLICT', 'Operation violates a business rule.', [
        { field: 'characterName', message: 'user cannot remove itself from the guild through this endpoint.' }
      ]);
    }

    if (actor.guildId !== target.guildId) {
      throw new AppError(403, 'FORBIDDEN', 'Authenticated user does not have permission for this operation.');
    }

    if (!canManageRank(actor.guildRank, target.guildRank)) {
      throw new AppError(403, 'FORBIDDEN', 'Authenticated user does not have permission for this operation.');
    }

    await userRepository.updateUserGuild(connection, target.id, null, null);
  });
}

async function leaveOwnGuild(authUserId) {
  return withTransaction(async (connection) => {
    const actor = await requireAuthenticatedUser(authUserId, connection, true);

    assertUserIsInGuild(actor);

    if (actor.guildRank === 'Leader') {
      throw new AppError(409, 'BUSINESS_RULE_CONFLICT', 'Operation violates a business rule.', [
        {
          field: 'guildRank',
          message: 'leader cannot leave the guild before transferring leadership.'
        }
      ]);
    }

    await userRepository.updateUserGuild(connection, actor.id, null, null);
  });
}

module.exports = {
  listGuilds,
  createGuild,
  deleteOwnGuild,
  listGuildMembers,
  addGuildMember,
  updateGuildMemberRank,
  removeGuildMember,
  leaveOwnGuild
};

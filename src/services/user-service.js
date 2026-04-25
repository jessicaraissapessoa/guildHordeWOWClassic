const { pool, withTransaction } = require('../db/pool');
const AppError = require('../errors/AppError');
const userRepository = require('../repositories/user-repository');
const {
  canonicalizeRoleType,
  assertRaceClassRoleCombination,
  normalizeUsername,
  normalizeCharacterName,
  normalizeGuildName,
  canonicalizeGuildRank,
  canonicalizeRace,
  canonicalizeClass,
  assertPagination,
  assertSort
} = require('../utils/validators');

function toUserResponse(user) {
  return {
    id: user.id,
    username: user.username,
    characterName: user.characterName,
    guildName: user.guildName || null,
    guildRank: user.guildRank || null,
    race: user.race,
    class: user.className,
    roleType: user.roleType,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

async function requireAuthenticatedUser(userId, executor = pool, lock = false) {
  const user = await userRepository.findUserById(executor, userId, lock);
  if (!user) {
    throw new AppError(401, 'UNAUTHORIZED', 'Authentication is required to access this resource.');
  }
  return user;
}

async function listUsers(query) {
  const { page, pageSize } = assertPagination(query);
  const { sortBy, sortOrder } = assertSort(query);

  const filters = {
    page,
    pageSize,
    sortBy,
    sortOrder
  };

  if (query.username) {
    filters.usernameNormalized = normalizeUsername(query.username);
  }
  if (query.characterName) {
    filters.characterNameNormalized = normalizeCharacterName(query.characterName);
  }
  if (query.guildName) {
    filters.guildNameNormalized = normalizeGuildName(query.guildName);
  }
  if (query.guildRank) {
    filters.guildRank = canonicalizeGuildRank(query.guildRank);
  }
  if (query.race) {
    filters.race = canonicalizeRace(query.race);
  }
  if (query.class) {
    filters.className = canonicalizeClass(query.class);
  }
  if (query.roleType) {
    filters.roleType = canonicalizeRoleType(query.roleType);
  }

  const result = await userRepository.listUsers(pool, filters);

  return {
    page,
    pageSize,
    total: result.total,
    totalPages: Math.ceil(result.total / pageSize),
    items: result.items.map(toUserResponse)
  };
}

async function updateOwnRoleType(authUserId, payload) {
  return withTransaction(async (connection) => {
    const user = await requireAuthenticatedUser(authUserId, connection, true);
    const roleType = canonicalizeRoleType(payload.roleType);

    assertRaceClassRoleCombination(user.race, user.className, roleType);

    await userRepository.updateUserRoleType(connection, authUserId, roleType);
    const updated = await userRepository.findUserById(connection, authUserId);
    return toUserResponse(updated);
  });
}

async function deleteOwnUser(authUserId) {
  return withTransaction(async (connection) => {
    const user = await requireAuthenticatedUser(authUserId, connection, true);

    if (user.guildRank === 'Leader') {
      throw new AppError(409, 'BUSINESS_RULE_CONFLICT', 'Operation violates a business rule.', [
        {
          field: 'guildRank',
          message: 'leader cannot delete the account before transferring leadership or deleting the guild.'
        }
      ]);
    }

    await userRepository.deleteUserById(connection, authUserId);
  });
}

module.exports = {
  listUsers,
  updateOwnRoleType,
  deleteOwnUser,
  requireAuthenticatedUser
};

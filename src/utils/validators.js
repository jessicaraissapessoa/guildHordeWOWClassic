const AppError = require('../errors/AppError');
const {
  RACES,
  CLASSES,
  ROLE_TYPES,
  GUILD_RANKS,
  CLASS_ROLE_MATRIX,
  RANK_HIERARCHY
} = require('../constants/domain');
const { normalizeToken, normalizeCaseInsensitive, trimString } = require('./normalization');

function assertRequiredString(value, field) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new AppError(400, 'VALIDATION_ERROR', 'Request body is invalid.', [
      { field, message: `${field} is required.` }
    ]);
  }
}

function assertUsername(value) {
  assertRequiredString(value, 'username');
  const username = trimString(value);
  const regex = /^(?!.*[._]{2})(?!.*[._]$)[a-z][a-z0-9._]{2,29}$/;

  if (!regex.test(username) || username.includes('_.') || username.includes('._')) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Request body is invalid.', [
      {
        field: 'username',
        message:
          'username must start with a letter, have 3 to 30 characters, and contain only lowercase letters, numbers, dot and underscore.'
      }
    ]);
  }

  return username;
}

function assertPassword(value) {
  assertRequiredString(value, 'password');
  const password = value;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const hasWhitespace = /\s/.test(password);

  if (
    password.length < 8 ||
    !hasUpper ||
    !hasLower ||
    !hasNumber ||
    !hasSymbol ||
    hasWhitespace
  ) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Request body is invalid.', [
      {
        field: 'password',
        message:
          'password must have at least 8 characters, uppercase, lowercase, number, symbol, and no spaces.'
      }
    ]);
  }

  return password;
}

function assertCharacterName(value) {
  assertRequiredString(value, 'characterName');
  const name = trimString(value);

  if (name.length < 2 || name.length > 12 || !/^\p{L}+$/u.test(name)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Request body is invalid.', [
      {
        field: 'characterName',
        message:
          'characterName must have 2 to 12 letters, accept accents, and cannot contain numbers, spaces or symbols.'
      }
    ]);
  }

  return name;
}

function assertGuildName(value) {
  assertRequiredString(value, 'guildName');
  const guildName = trimString(value);

  if (
    guildName.length < 2 ||
    guildName.length > 24 ||
    !/^[\p{L}]+(?: [\p{L}]+)*$/u.test(guildName)
  ) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Request body is invalid.', [
      {
        field: 'guildName',
        message:
          'guildName must have 2 to 24 characters, letters and internal spaces only, without numbers or symbols.'
      }
    ]);
  }

  return guildName;
}

function canonicalizeEnum(value, dictionary, field) {
  assertRequiredString(value, field);
  const canonical = dictionary[normalizeToken(value)];

  if (!canonical) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Request body is invalid.', [
      { field, message: `${field} has an invalid value.` }
    ]);
  }

  return canonical;
}

function canonicalizeRace(value) {
  return canonicalizeEnum(value, RACES, 'race');
}

function canonicalizeClass(value) {
  return canonicalizeEnum(value, CLASSES, 'class');
}

function canonicalizeRoleType(value) {
  return canonicalizeEnum(value, ROLE_TYPES, 'roleType');
}

function canonicalizeGuildRank(value) {
  return canonicalizeEnum(value, GUILD_RANKS, 'guildRank');
}

function assertRaceClassRoleCombination(race, className, roleType) {
  const allowedRoles = CLASS_ROLE_MATRIX[race] && CLASS_ROLE_MATRIX[race][className];

  if (!allowedRoles || !allowedRoles.includes(roleType)) {
    throw new AppError(
      409,
      'BUSINESS_RULE_CONFLICT',
      'Operation violates a business rule.',
      [
        {
          field: 'roleType',
          message: 'race, class and roleType combination is invalid.'
        }
      ]
    );
  }
}

function normalizeUsername(value) {
  return normalizeCaseInsensitive(value);
}

function normalizeCharacterName(value) {
  return normalizeCaseInsensitive(value);
}

function normalizeGuildName(value) {
  return normalizeCaseInsensitive(value);
}

function assertPagination(query) {
  const page = query.page ? Number(query.page) : 1;
  const pageSize = query.pageSize ? Number(query.pageSize) : 20;

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

  return { page, pageSize };
}

function assertSort(query) {
  const allowed = new Set([
    'username',
    'characterName',
    'guildName',
    'guildRank',
    'race',
    'class',
    'roleType',
    'createdAt'
  ]);
  const sortBy = query.sortBy || 'createdAt';
  const sortOrder = (query.sortOrder || 'asc').toLowerCase();

  if (!allowed.has(sortBy)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Request query is invalid.', [
      { field: 'sortBy', message: 'sortBy has an invalid value.' }
    ]);
  }

  if (!['asc', 'desc'].includes(sortOrder)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Request query is invalid.', [
      { field: 'sortOrder', message: 'sortOrder must be asc or desc.' }
    ]);
  }

  return { sortBy, sortOrder };
}

function canManageRank(actorRank, targetRank) {
  return (RANK_HIERARCHY[actorRank] || 0) > (RANK_HIERARCHY[targetRank] || 0);
}

module.exports = {
  assertUsername,
  assertPassword,
  assertCharacterName,
  assertGuildName,
  canonicalizeRace,
  canonicalizeClass,
  canonicalizeRoleType,
  canonicalizeGuildRank,
  assertRaceClassRoleCombination,
  normalizeUsername,
  normalizeCharacterName,
  normalizeGuildName,
  assertPagination,
  assertSort,
  canManageRank,
  assertRequiredString
};

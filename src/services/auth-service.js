const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { pool } = require('../db/pool');
const AppError = require('../errors/AppError');
const userRepository = require('../repositories/user-repository');
const {
  assertUsername,
  assertPassword,
  assertCharacterName,
  canonicalizeRace,
  canonicalizeClass,
  canonicalizeRoleType,
  assertRaceClassRoleCombination,
  normalizeUsername,
  normalizeCharacterName
} = require('../utils/validators');

function toUserResponse(user) {
  return {
    id: user.id,
    username: user.username,
    characterName: user.characterName,
    guildName: user.guildName || null,
    guildRank: user.guildRank || null,
    race: user.race,
    class: canonicalizeClass(user.className),
    roleType: user.roleType,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

async function register(payload) {
  const username = assertUsername(payload.username);
  const password = assertPassword(payload.password);
  const characterName = assertCharacterName(payload.characterName);
  const race = canonicalizeRace(payload.race);
  const className = canonicalizeClass(payload.class);
  const roleType = canonicalizeRoleType(payload.roleType);

  assertRaceClassRoleCombination(race, className, roleType);

  const usernameNormalized = normalizeUsername(username);
  const characterNameNormalized = normalizeCharacterName(characterName);

  const existingUsername = await userRepository.findUserByUsernameNormalized(
    pool,
    usernameNormalized
  );
  if (existingUsername) {
    throw new AppError(409, 'BUSINESS_RULE_CONFLICT', 'Operation violates a business rule.', [
      { field: 'username', message: 'username is already in use.' }
    ]);
  }

  const existingCharacter = await userRepository.findUserByCharacterNameNormalized(
    pool,
    characterNameNormalized
  );
  if (existingCharacter) {
    throw new AppError(409, 'BUSINESS_RULE_CONFLICT', 'Operation violates a business rule.', [
      { field: 'characterName', message: 'characterName is already in use.' }
    ]);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const userId = await userRepository.createUser(pool, {
    username,
    usernameNormalized,
    passwordHash,
    characterName,
    characterNameNormalized,
    race,
    className,
    roleType,
    guildId: null,
    guildRank: null
  });

  const user = await userRepository.findUserById(pool, userId);
  return toUserResponse(user);
}

async function login(payload) {
  const username = assertUsername(payload.username);
  const password = typeof payload.password === 'string' ? payload.password : '';

  if (password.trim() === '') {
    throw new AppError(400, 'VALIDATION_ERROR', 'Request body is invalid.', [
      { field: 'password', message: 'password is required.' }
    ]);
  }

  const user = await userRepository.findUserByUsernameNormalized(
    pool,
    normalizeUsername(username)
  );

  if (!user) {
    throw new AppError(401, 'UNAUTHORIZED', 'Invalid credentials.');
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    throw new AppError(401, 'UNAUTHORIZED', 'Invalid credentials.');
  }

  const accessToken = jwt.sign(
    {
      username: user.username
    },
    env.jwt.secret,
    {
      subject: String(user.id),
      expiresIn: env.jwt.expiresIn
    }
  );

  return {
    accessToken,
    tokenType: 'Bearer',
    expiresIn: 3600
  };
}

module.exports = {
  register,
  login
};

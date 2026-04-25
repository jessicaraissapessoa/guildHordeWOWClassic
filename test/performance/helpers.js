import http from 'k6/http';

const baseUrl = __ENV.BASE_URL || 'http://localhost:3000';

export function randomLetters(length = 6) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  let output = '';

  for (let index = 0; index < length; index += 1) {
    output += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return output;
}

export function buildUser(overrides = {}) {
  const suffix = randomLetters(6);

  return {
    username: overrides.username || `user.${suffix}`,
    password: overrides.password || 'Senha@123',
    characterName: overrides.characterName || `Ab${randomLetters(4)}`,
    race: overrides.race || 'Orc',
    class: overrides.class || 'Xamã',
    roleType: overrides.roleType || 'DPS'
  };
}

export function jsonHeaders(token) {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export function registerUser(user) {
  return http.post(
    `${baseUrl}/auth/register`,
    JSON.stringify(user),
    { headers: jsonHeaders() }
  );
}

export function loginUser(username, password) {
  return http.post(
    `${baseUrl}/auth/login`,
    JSON.stringify({ username, password }),
    { headers: jsonHeaders() }
  );
}

export function createGuild(token, guildName) {
  return http.post(
    `${baseUrl}/guilds`,
    JSON.stringify({ guildName }),
    { headers: jsonHeaders(token) }
  );
}

export function addGuildMember(token, characterName) {
  return http.post(
    `${baseUrl}/guilds/members`,
    JSON.stringify({ characterName }),
    { headers: jsonHeaders(token) }
  );
}

export function updateGuildRank(token, characterName, guildRank) {
  return http.patch(
    `${baseUrl}/guilds/members/${encodeURIComponent(characterName)}/rank`,
    JSON.stringify({ guildRank }),
    { headers: jsonHeaders(token) }
  );
}

export function deleteOwnGuild(token) {
  return http.del(
    `${baseUrl}/guilds/me`,
    null,
    { headers: jsonHeaders(token) }
  );
}

export function getUsers(token, queryString = '') {
  return http.get(
    `${baseUrl}/users${queryString}`,
    { headers: jsonHeaders(token) }
  );
}

export function failIfStatusIsNot(response, expectedStatus, context) {
  if (response.status !== expectedStatus) {
    throw new Error(`${context}: esperado ${expectedStatus}, recebido ${response.status}`);
  }
}

export { baseUrl };

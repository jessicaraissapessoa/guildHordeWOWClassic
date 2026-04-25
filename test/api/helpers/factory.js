function randomLetters(length = 5) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  let output = '';

  for (let index = 0; index < length; index += 1) {
    output += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return output;
}

function buildUser(overrides = {}) {
  const suffix = randomLetters(5);

  return {
    username: `user.${suffix}`,
    password: 'Senha@123',
    characterName: `Abc${suffix}`.slice(0, 6),
    race: 'Orc',
    class: 'Xamã',
    roleType: 'DPS',
    ...overrides
  };
}

function buildGuildName() {
  return `Horda ${randomLetters(5)}`;
}

module.exports = {
  buildUser,
  buildGuildName
};

function trimString(value) {
  return typeof value === 'string' ? value.trim() : value;
}

function normalizeCaseInsensitive(value, options = {}) {
  const { trim = true } = options;
  if (typeof value !== 'string') {
    return '';
  }

  const prepared = trim ? value.trim() : value;
  return prepared.toLocaleLowerCase('pt-BR');
}

function normalizeToken(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[\s_-]+/g, '')
    .toLocaleLowerCase('pt-BR');
}

module.exports = {
  trimString,
  normalizeCaseInsensitive,
  normalizeToken
};

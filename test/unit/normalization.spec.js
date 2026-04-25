const { expect } = require('chai');
const {
  trimString,
  normalizeCaseInsensitive,
  normalizeToken
} = require('../../src/utils/normalization');

describe('Normalização unitária', () => {
  it('deve remover espaços nas extremidades com trimString', () => {
    expect(trimString('  Thrall  ')).to.equal('Thrall');
  });

  it('deve preservar valores não string em trimString', () => {
    expect(trimString(null)).to.equal(null);
    expect(trimString(123)).to.equal(123);
  });

  it('deve normalizar texto de forma case-insensitive com trim por padrão', () => {
    expect(normalizeCaseInsensitive('  LíDeR  ')).to.equal('líder');
  });

  it('deve permitir normalização sem trim quando solicitado', () => {
    expect(normalizeCaseInsensitive('  Orc  ', { trim: false })).to.equal('  orc  ');
  });

  it('deve retornar string vazia quando normalizeCaseInsensitive receber valor não string', () => {
    expect(normalizeCaseInsensitive(undefined)).to.equal('');
  });

  it('deve normalizar token removendo acentuação, espaços, hífen e underscore', () => {
    expect(normalizeToken(' Xamã ')).to.equal('xama');
    expect(normalizeToken('Morto-vivo')).to.equal('mortovivo');
    expect(normalizeToken('role_type')).to.equal('roletype');
  });

  it('deve retornar string vazia quando normalizeToken receber valor não string', () => {
    expect(normalizeToken(undefined)).to.equal('');
  });
});

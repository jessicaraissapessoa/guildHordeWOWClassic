const { expect } = require('chai');
const AppError = require('../../src/errors/AppError');
const {
  assertRequiredString,
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
  canManageRank
} = require('../../src/utils/validators');

function capturarErro(fn) {
  try {
    fn();
    throw new Error('Era esperado um erro, mas nada foi lançado.');
  } catch (error) {
    return error;
  }
}

describe('Validadores unitários', () => {
  it('deve validar string obrigatória', () => {
    expect(assertRequiredString('valor', 'campo')).to.equal(undefined);
  });

  it('deve rejeitar string obrigatória vazia', () => {
    const error = capturarErro(() => assertRequiredString('   ', 'campo'));

    expect(error).to.be.instanceOf(AppError);
    expect(error.statusCode).to.equal(400);
    expect(error.error).to.equal('VALIDATION_ERROR');
  });

  it('deve aceitar username válido', () => {
    expect(assertUsername('thrall.user')).to.equal('thrall.user');
  });

  it('deve rejeitar username inválido com letras maiúsculas', () => {
    const error = capturarErro(() => assertUsername('Thrall'));

    expect(error).to.be.instanceOf(AppError);
    expect(error.statusCode).to.equal(400);
  });

  it('deve aceitar senha válida', () => {
    expect(assertPassword('Senha@123')).to.equal('Senha@123');
  });

  it('deve rejeitar senha com espaço', () => {
    const error = capturarErro(() => assertPassword('Senha @123'));

    expect(error).to.be.instanceOf(AppError);
    expect(error.statusCode).to.equal(400);
  });

  it('deve aceitar nome de personagem válido com acento', () => {
    expect(assertCharacterName('Thráll')).to.equal('Thráll');
  });

  it('deve rejeitar nome de personagem com número', () => {
    const error = capturarErro(() => assertCharacterName('Thrall2'));

    expect(error).to.be.instanceOf(AppError);
    expect(error.statusCode).to.equal(400);
  });

  it('deve aceitar nome de guilda válido com espaços internos', () => {
    expect(assertGuildName('Horda Suprema')).to.equal('Horda Suprema');
  });

  it('deve rejeitar nome de guilda com números', () => {
    const error = capturarErro(() => assertGuildName('Guilda 123'));

    expect(error).to.be.instanceOf(AppError);
    expect(error.statusCode).to.equal(400);
  });

  it('deve canonizar raça ignorando caixa e acento', () => {
    expect(canonicalizeRace('mórto-vivo')).to.equal('Morto-vivo');
  });

  it('deve canonizar classe ignorando acento', () => {
    expect(canonicalizeClass('xama')).to.equal('Xamã');
    expect(canonicalizeClass('xamá')).to.equal('Xamã');
  });

  it('deve canonizar roleType ignorando caixa', () => {
    expect(canonicalizeRoleType('healer')).to.equal('Healer');
  });

  it('deve canonizar guildRank ignorando acento e idioma', () => {
    expect(canonicalizeGuildRank('líder')).to.equal('Leader');
    expect(canonicalizeGuildRank('oficial')).to.equal('Officer');
  });

  it('deve rejeitar enum inválido', () => {
    const error = capturarErro(() => canonicalizeGuildRank('general'));

    expect(error).to.be.instanceOf(AppError);
    expect(error.statusCode).to.equal(400);
  });

  it('deve aceitar combinação válida de raça, classe e função', () => {
    expect(() => assertRaceClassRoleCombination('Orc', 'Xamã', 'DPS')).to.not.throw();
  });

  it('deve rejeitar combinação inválida de raça, classe e função', () => {
    const error = capturarErro(() => assertRaceClassRoleCombination('Orc', 'Bruxo', 'Tank'));

    expect(error).to.be.instanceOf(AppError);
    expect(error.statusCode).to.equal(409);
    expect(error.error).to.equal('BUSINESS_RULE_CONFLICT');
  });

  it('deve normalizar username, characterName e guildName para comparação case-insensitive', () => {
    expect(normalizeUsername(' Thrall.User ')).to.equal('thrall.user');
    expect(normalizeCharacterName(' Thrall ')).to.equal('thrall');
    expect(normalizeGuildName(' UmaGuilda ')).to.equal('umaguilda');
  });

  it('deve aceitar paginação padrão quando query vier vazia', () => {
    expect(assertPagination({})).to.deep.equal({ page: 1, pageSize: 20 });
  });

  it('deve rejeitar paginação inválida', () => {
    const error = capturarErro(() => assertPagination({ page: '0', pageSize: '10' }));

    expect(error).to.be.instanceOf(AppError);
    expect(error.statusCode).to.equal(400);
  });

  it('deve aceitar ordenação válida', () => {
    expect(assertSort({ sortBy: 'username', sortOrder: 'desc' })).to.deep.equal({
      sortBy: 'username',
      sortOrder: 'desc'
    });
  });

  it('deve rejeitar ordenação inválida', () => {
    const error = capturarErro(() => assertSort({ sortBy: 'invalido', sortOrder: 'desc' }));

    expect(error).to.be.instanceOf(AppError);
    expect(error.statusCode).to.equal(400);
  });

  it('deve respeitar hierarquia de cargos', () => {
    expect(canManageRank('Leader', 'Officer')).to.equal(true);
    expect(canManageRank('Officer', 'Member')).to.equal(true);
    expect(canManageRank('Member', 'Officer')).to.equal(false);
    expect(canManageRank('Officer', 'Officer')).to.equal(false);
  });
});

const { expect } = require('chai');
const AppError = require('../../src/errors/AppError');

describe('AppError unitário', () => {
  it('deve instanciar erro de aplicação com status, código e detalhes', () => {
    const details = [{ field: 'username', message: 'username is required.' }];
    const error = new AppError(400, 'VALIDATION_ERROR', 'Request body is invalid.', details);

    expect(error).to.be.instanceOf(Error);
    expect(error.statusCode).to.equal(400);
    expect(error.error).to.equal('VALIDATION_ERROR');
    expect(error.message).to.equal('Request body is invalid.');
    expect(error.details).to.deep.equal(details);
  });
});

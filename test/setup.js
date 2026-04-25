process.env.NODE_ENV = 'test';

const { resetDatabase, closeDatabase } = require('./api/helpers/db');

exports.mochaHooks = {
  async beforeAll() {
    await resetDatabase();
  },
  async beforeEach() {
    await resetDatabase();
  },
  async afterAll() {
    await closeDatabase();
  }
};

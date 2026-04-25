const { pool } = require('../../../src/db/pool');

async function resetDatabase() {
  await pool.query('SET FOREIGN_KEY_CHECKS = 0');
  await pool.query('TRUNCATE TABLE users');
  await pool.query('TRUNCATE TABLE guilds');
  await pool.query('SET FOREIGN_KEY_CHECKS = 1');
}

async function closeDatabase() {
  await pool.end();
}

module.exports = {
  resetDatabase,
  closeDatabase
};

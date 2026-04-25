const app = require('./app');
const env = require('./config/env');
const { pool } = require('./db/pool');

async function start() {
  await pool.query('SELECT 1');

  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});

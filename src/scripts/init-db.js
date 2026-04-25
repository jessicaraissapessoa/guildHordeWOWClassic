const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
if (process.argv.includes('--env=test')) {
  process.env.NODE_ENV = 'test';
}
const env = require('../config/env');

function buildSchemaSql(databaseName, template) {
  return template.replaceAll('guild_horde_wow_classic', databaseName);
}

async function run() {
  const schemaPath = path.join(__dirname, '../../sql/schema.sql');
  const template = fs.readFileSync(schemaPath, 'utf8');
  const sql = buildSchemaSql(env.db.database, template);
  const connection = await mysql.createConnection({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    multipleStatements: true
  });

  await connection.query(sql);
  await connection.end();
  console.log('Database schema initialized successfully.');
}

run().catch((error) => {
  console.error('Failed to initialize database schema:', error.message);
  process.exit(1);
});

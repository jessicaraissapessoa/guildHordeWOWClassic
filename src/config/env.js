const dotenv = require('dotenv');
const path = require('path');

const explicitEnv = process.env.ENV_FILE;
const targetEnv = process.env.NODE_ENV === 'test' || process.argv.includes('--env=test')
  ? '.env.test'
  : '.env';

dotenv.config({
  path: explicitEnv || path.join(process.cwd(), targetEnv)
});

const required = [
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'JWT_SECRET'
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

module.exports = {
  port: Number(process.env.PORT || 3000),
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  }
};

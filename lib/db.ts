import mysql from 'mysql2/promise';

const requiredVars = [
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
] as const;

let pool: mysql.Pool | null = null;

function getRequiredEnv(key: (typeof requiredVars)[number]) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function getPool() {
  if (pool) {
    return pool;
  }

  const host = getRequiredEnv('DB_HOST');
  const port = Number(getRequiredEnv('DB_PORT'));
  const user = getRequiredEnv('DB_USER');
  const password = getRequiredEnv('DB_PASSWORD');
  const database = getRequiredEnv('DB_NAME');

  pool = mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  return pool;
}

export async function ensureUsersTable() {
  const currentPool = getPool();
  await currentPool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      username VARCHAR(50) NOT NULL,
      email VARCHAR(191) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY users_email_unique (email),
      UNIQUE KEY users_username_unique (username)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
}

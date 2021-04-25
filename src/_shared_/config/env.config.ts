import 'dotenv/config';

const {
  NODE_ENV,
  PORT,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_TEST_DB,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  DATABASE_SSL,
  DB_NO_SYNC,
  ADMIN_USERNAME,
  ADMIN_PWD,
} = process.env;

export const global = {
  nodeEnv: NODE_ENV,
  port: +PORT || 5000,
};

export const db = {
  database: NODE_ENV === 'test' ? POSTGRES_TEST_DB : POSTGRES_DB,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  host: POSTGRES_HOST || 'localhost',
  ssl: DATABASE_SSL,
  noSync: DB_NO_SYNC,
};

export const jwt = {
  secret: JWT_SECRET,
  expiresIn: JWT_EXPIRES_IN,
};

export const adminAuth = {
  username: ADMIN_USERNAME,
  password: ADMIN_PWD,
};

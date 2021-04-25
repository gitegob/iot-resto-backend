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
};

export const jwt = {
  secret: JWT_SECRET,
  expiresIn: JWT_EXPIRES_IN,
};

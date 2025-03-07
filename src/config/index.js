import dotenv from 'dotenv';

dotenv.config();

export const BACKEND_PORT = process.env.BACK_PORT || 3000;

export const NODE_ENV = process.env.NODE_ENV;
export const NODE_MODE = process.env.NODE_MODE;

export const JWT_SECRET = process.env.JWT_SECRET;

export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export const DB_URL = process.env.DB_URL;

export const HASH_SECRET = process.env.HASH_SECRET;

export const DO_SPACES_KEY = process.env.DO_SPACES_KEY;
export const DO_SPACES_SECRET = process.env.DO_SPACES_SECRET;
export const DO_SPACES_REGION = process.env.DO_SPACES_REGION;
export const DO_SPACES_ENDPOINT = process.env.DO_SPACES_ENDPOINT;
export const DO_SPACES_BUCKET = process.env.DO_SPACES_BUCKET;

export const AUX_URL = process.env.AUX_URL;
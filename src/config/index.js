import dotenv from 'dotenv';

dotenv.config();

export const BACKEND_PORT = process.env.BACK_PORT || 3000;

export const NODE_ENV = process.env.NODE_ENV;
export const NODE_MODE = process.env.NODE_MODE;

export const JWT_SECRET = process.env.JWT_SECRET;

export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export const DB_URL = process.env.DB_URL;
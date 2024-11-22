import dotenv from 'dotenv';

dotenv.config();

export const BACKEND_URL =  process.env.BACKEND_URL || 'http://localhost:3000';

export const BACKEND_PORT = process.env.BACK_PORT || 3000;

export const DB_URL = process.env.DB_URL || 'mysql://root:root@localhost:3306/mydb';
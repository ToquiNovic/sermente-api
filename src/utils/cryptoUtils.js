// utils/cryptoUtils.js
import bcrypt from 'bcryptjs';
import { HASH_SECRET } from '../config/index.js';

const SALT_ROUNDS = 10;

if (!HASH_SECRET) {
  throw new Error("La variable de entorno HASH_SECRET no está definida.");
}

// Función para hashear una contraseña
export const hashPassword = async (password) => {
  const passwordWithSecret = password + HASH_SECRET;
  return await bcrypt.hash(passwordWithSecret, SALT_ROUNDS);
};

// Función para comparar una contraseña con un hash almacenado
export const comparePassword = async (inputPassword, storedHash) => {
  const passwordWithSecret = inputPassword + HASH_SECRET;
  return await bcrypt.compare(passwordWithSecret, storedHash);
};

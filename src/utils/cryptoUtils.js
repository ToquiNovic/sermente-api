import crypto from 'crypto';

// Obtener la clave de hash desde las variables de entorno
const HASH_SECRET = process.env.HASH_SECRET;

if (!HASH_SECRET) {
  throw new Error("La variable de entorno HASH_SECRET no está definida.");
}

// Función para generar un hash de una contraseña
export const hashPassword = (password) => {
  return crypto
    .createHmac('sha256', HASH_SECRET) 
    .update(password)
    .digest('hex');
};

// Función para comparar una contraseña con un hash
export const comparePassword = (inputPassword, storedHash) => {
  const inputHash = hashPassword(inputPassword);
  return inputHash === storedHash;
};
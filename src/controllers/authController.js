import { models } from "../database/conexion.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";

export const login = async (req, res) => {
  const { numberDoc, password } = req.body;

  try {
    // Buscar al usuario en la base de datos
    const user = await models.User.findOne({ where: { numberDoc } });

    // Si no existe el usuario, devolver un error 404
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generar el token JWT
    const token = generateToken({
      id: user.id,
      numberDoc: user.numberDoc,
      roleId: user.roleId,
    });

    // Devolver el token junto con el ID del usuario
    res.status(200).json({
      id: user.id,             // ID del usuario
      accessToken: token,      // Token JWT
      message: "Login successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in", error });
  }
};

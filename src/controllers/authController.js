import { models } from "../database/conexion.js";
import { comparePassword } from "../utils/cryptoUtils.js";
import { generateToken } from "../utils/jwt.js";

export const login = async (req, res) => {
  const { numberDoc, password, isSpecialist } = req.body;

  try {
    if (typeof isSpecialist !== "boolean") {
      return res.status(400).json({ message: "El campo 'isSpecialist' es requerido y debe ser un booleano" });
    }

    const user = await models.User.findOne({ where: { numberDoc } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const userRole = await models.UserRole.findOne({
      where: {
        userId: user.id,
        state: true, 
      },
    });

    if (!userRole) {
      return res.status(403).json({ message: "No se encontró un rol activo para este usuario" });
    }

    const respondentRole = await models.Role.findOne({ where: { name: "Encuestado", state: true } });
    if (!respondentRole) {
      return res.status(500).json({ message: "Error en la configuración de roles en el servidor" });
    }

    const RESPONDENT_ROLE_ID = respondentRole.id;
    const isRespondent = userRole.roleId === RESPONDENT_ROLE_ID;

    if (!isRespondent || isSpecialist) {
      if (!password) {
        return res.status(400).json({ message: "Las credenciales de los especialistas son obligatorias" });
      }
      const isMatch = comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }
    }

    if (isRespondent && isSpecialist) {
      return res.status(403).json({ message: "Los encuestados no pueden iniciar sesión como especialistas" });
    }

    const token = generateToken({
      id: user.id,
      numberDoc: user.numberDoc,
      roleId: userRole.roleId,
    });

    res.status(200).json({
      id: user.id,
      accessToken: token,
      message: "Inicio de sesión exitoso",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al iniciar sesión", error });
  }
};
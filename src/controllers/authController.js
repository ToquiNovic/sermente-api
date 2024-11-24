import { models } from "../database/conexion.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";

export const login = async (req, res) => {
  const { numberDoc, password } = req.body;

  try {
    const user = await models.User.findOne({ where: { numberDoc } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
      id: user.id,
      numberDoc: user.numberDoc,
      roleId: user.roleId,
    });

    res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in", error });
  }
};

export const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      return res.status(401).json({ message: "Invalid token." });
    }

    res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging out", error });
  }
};

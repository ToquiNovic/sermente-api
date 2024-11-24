import { models } from "../database/conexion.js";

export const createUser = async (req, res) => {
  const { numberDoc, password, roleId } = req.body;

  // Validación básica de los campos requeridos
  if (!numberDoc || !password || !roleId) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Verifica si el número de documento ya existe
    const existingUser = await models.User.findOne({ where: { numberDoc } });
    if (existingUser) {
      return res.status(409).json({ message: "User with this numberDoc already exists." });
    }

    // Crea el usuario
    const newUser = await models.User.create({ numberDoc, password, roleId });

    // Excluye la contraseña del objeto retornado
    const { password: _, ...userWithoutPassword } = newUser.toJSON();

    res.status(201).json({
      message: "User created successfully.",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user.", error });
  }
};

export const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await models.User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ message: "Error getting user.", error });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await models.User.findAll();

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error getting all users:", error);
    res.status(500).json({ message: "Error getting all users.", error });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const user = await models.User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.status(200).json({ message: "User updated successfully." });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user.", error });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await models.User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await user.destroy();

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user.", error });
  }
};  

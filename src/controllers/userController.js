import { models } from "../database/conexion.js";
import { hashPassword } from "../utils/cryptoUtils.js"; 

export const createUser = async (req, res) => {
  let { numberDoc, password, roleNames } = req.body;

  if (!numberDoc || !roleNames) {
    return res.status(400).json({ message: "El número de documento y los roles son obligatorios." });
  }

  if (!Array.isArray(roleNames)) {
    roleNames = [roleNames];
  }

  try {
    const existingUser = await models.User.findOne({ where: { numberDoc } });
    if (existingUser) {
      return res.status(409).json({ message: "El usuario ya existe." });
    }

    // Buscar roles por su nombre en la base de datos
    const roles = await models.Role.findAll({ where: { name: roleNames } });

    if (roles.length !== roleNames.length) {
      return res.status(400).json({ message: "Uno o más roles no existen." });
    }

    const isEncuestado = roles.some((role) => role.name === "Encuestado");

    let hashedPassword = null;
    if (!isEncuestado) {
      if (!password) {
        return res.status(400).json({ message: "La contraseña es obligatoria excepto para encuestados." });
      }
      hashedPassword = await hashPassword(password);
    }

    const newUser = await models.User.create({ numberDoc, password: hashedPassword });

    // Asignar los roles usando los IDs obtenidos
    const roleIdsDB = roles.map(role => role.id);
    await newUser.addRoles(roleIdsDB);

    const { password: _, ...userWithoutPassword } = newUser.toJSON();

    res.status(201).json({
      message: "Usuario creado exitosamente.",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ message: "Error al crear usuario.", error });
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
    const users = await models.User.findAll({
      attributes: ["id", "numberDoc", "state"],
      include: [
        {
          model: models.Role,
          attributes: ["id", "name"],
          as: "roles",
          through: { attributes: [] },
        },
      ]      
    });

    const formattedUsers = users.map(user => ({
      id: user.id,
      numberDoc: user.numberDoc,
      state: user.state,
      roles: user.roles ? user.roles.map(role => ({ id: role.id, name: role.name })) : [],
    }));

    res.status(200).json({ users: formattedUsers });
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
      user.password = hashPassword(password);
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

export const assignRoleToUser = async (req, res) => {
  const { id } = req.params;
  const { roleId } = req.body;

  if (!roleId) {
    return res.status(400).json({ message: "Role ID is required." });
  }

  try {
    const user = await models.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const role = await models.Role.findByPk(roleId);
    if (!role) {
      return res.status(404).json({ message: "Role not found." });
    }

    await user.addRole(role);

    res.status(200).json({ message: "Role assigned successfully." });
  } catch (error) {
    console.error("Error assigning role:", error);
    res.status(500).json({ message: "Error assigning role.", error });
  }
};

export const removeRoleFromUser = async (req, res) => {
  const { id } = req.params;
  const { roleId } = req.body;

  if (!roleId) {
    return res.status(400).json({ message: "Role ID is required." });
  }

  try {
    const user = await models.User.findByPk(id, {
      include: {
        model: models.Role,
        as: "roles",
        through: { attributes: [] },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const role = await models.Role.findByPk(roleId);
    if (!role) {
      return res.status(404).json({ message: "Role not found." });
    }

    // Verificar si el usuario tiene el rol asignado
    const hasRole = user.roles.some((r) => r.id == roleId);
    if (!hasRole) {
      return res.status(400).json({ message: "User does not have this role assigned." });
    }

    // Eliminar la relación
    await user.removeRole(role);

    res.status(200).json({ message: "Role removed successfully." });
  } catch (error) {
    console.error("Error removing role:", error);
    res.status(500).json({ message: "Error removing role.", error });
  }
};

// servicio para actializar el estado de un usuario
export const updateState = async (req, res) => {
  const { id } = req.params;
  const { state } = req.body;

  console.log(state);  

  const validStates = ["active", "inactive", "suspended"];

  if (!validStates.includes(state)) {
    return res.status(400).json({ message: `Invalid state. Allowed values: ${validStates.join(", ")}` });
  }

  try {
    const user = await models.User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.state = state;
    await user.save();

    res.status(200).json({ message: "User state updated successfully.", user });
  } catch (error) {
    console.error("Error updating user state:", error);
    res.status(500).json({ message: "Error updating user state.", error });
  }
};

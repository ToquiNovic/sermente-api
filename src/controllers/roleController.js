import { models } from "../database/conexion.js";

export const createRole = async (req, res) => {
  const { name, description, state } = req.body;

  try {
    // Verificar si ya existe un rol con el mismo nombre
    const existingRole = await models.Role.findOne({ where: { name } });

    if (existingRole) {
      return res.status(400).json({ message: "Role with this name already exists." });
    }

    // Crear el nuevo rol si no existe uno con el mismo nombre
    const role = await models.Role.create({ name, description, state });

    res.status(201).json({ message: "Role created successfully.", role });
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({ message: "Error creating role.", error });
  }
};

export const getRole = async (req, res) => {
  const { id } = req.params;

  try {
    const role = await models.Role.findByPk(id);

    if (!role) {
      return res.status(404).json({ message: "Role not found." });
    }

    res.status(200).json({ role });
  } catch (error) {
    console.error("Error getting role:", error);
    res.status(500).json({ message: "Error getting role.", error });
  }
};

export const getAllRoles = async (req, res) => {
  try {
    const roles = await models.Role.findAll();

    res.status(200).json({ roles });
  } catch (error) {
    console.error("Error getting all roles:", error);
    res.status(500).json({ message: "Error getting all roles.", error });
  }
};

export const updateRole = async (req, res) => {
  const { id } = req.params;
  const { name, description, state } = req.body;

  try {
    const role = await models.Role.findByPk(id);

    if (!role) {
      return res.status(404).json({ message: "Role not found." });
    }

    if (name) {
      role.name = name;
    }

    if (description) {
      role.description = description;
    }

    if (state !== undefined) {
      role.state = state;
    }

    await role.save();

    res.status(200).json({ message: "Role updated successfully.", role });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ message: "Error updating role.", error });
  }
};

export const deleteRole = async (req, res) => {
  const { id } = req.params;

  try {
    const role = await models.Role.findByPk(id);

    if (!role) {
      return res.status(404).json({ message: "Role not found." });
    }

    // Verificar si hay usuarios con este rol
    const usersWithRole = await models.User.count({
      where: { roleId: id },
    });

    if (usersWithRole > 0) {
      return res.status(400).json({
        message: "Cannot delete role. There are users assigned to this role.",
      });
    }

    await role.destroy();

    res.status(200).json({ message: "Role deleted successfully." });
  } catch (error) {
    console.error("Error deleting role:", error);
    res.status(500).json({ message: "Error deleting role.", error });
  }
};

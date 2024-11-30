import { models } from "../database/conexion.js";

export const createRole = async (req, res) => {
  const { name, description, state } = req.body;

  try {
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

    if (state) {
      role.state = state;
    }

    await role.save();

    res.status(200).json({ message: "Role updated successfully." });
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

    await role.destroy();

    res.status(200).json({ message: "Role deleted successfully." });
  } catch (error) {
    console.error("Error deleting role:", error);
    res.status(500).json({ message: "Error deleting role.", error });
  }
};
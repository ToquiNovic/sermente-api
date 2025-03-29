// controllers/companyController.js
import { models } from "../database/conexion.js";
import { AUX_URL } from "../config/index.js";
import { Op } from "sequelize";

export const createCompany = async (req, res) => {
  const {
    id,
    specialistId,
    nameCompany,
    legalAgent,
    nitCompany,
    address,
    phone,
    email,
    extensionFile,
    numberOfEmployees,
  } = req.body;

  try {
    if (
      !id ||
      !specialistId ||
      !nameCompany ||
      !legalAgent ||
      !numberOfEmployees ||
      !nitCompany
    ) {
      return res.status(400).json({
        message: "Todos los campos obligatorios deben ser completados.",
      });
    }

    const urlLogo = `${AUX_URL}/companies/${id}.${extensionFile}`;

    // Crear la empresa
    const company = await models.Company.create({
      id,
      name: nameCompany,
      legalAgent,
      nitCompany,
      address,
      phone,
      email,
      urlIcon: urlLogo,
      numberOfEmployees,
    });

    // Verificar si el usuario ya tiene una relación con esta empresa
    const existingUserCompany = await models.UserCompany.findOne({
      where: { companyId: company.id },
    });

    if (!existingUserCompany) {
      await models.UserCompany.create({
        userId: specialistId,
        companyId: company.id,
        specialistId: specialistId,
      });
    }

    return res
      .status(201)
      .json({ message: "Empresa creada exitosamente.", company });
  } catch (error) {
    console.error("Error al crear la empresa:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor.", error: error.message });
  }
};

export const getAllCompanies = async (req, res) => {
  try {
    const companies = await models.UserCompany.findAll({
      attributes: ["companyId", "specialistId"],
      include: [
        {
          model: models.Company,
          as: "company",
          attributes: [
            "id",
            "name",
            "nitCompany",
            "legalAgent",
            "address",
            "phone",
            "email",
            "urlIcon",
            "numberOfEmployees",
          ],
        },
      ],
      where: {
        specialistId: { [Op.ne]: null },
      },
      order: [["createdAt", "DESC"]],
    });

    // Usar un Map para evitar duplicados por companyId
    const uniqueCompanies = new Map();

    companies.forEach(({ companyId, specialistId, company }) => {
      if (!uniqueCompanies.has(companyId)) {
        uniqueCompanies.set(companyId, {
          id: companyId,
          specialistId,
          name: company.name,
          nitCompany: company.nitCompany,
          legalAgent: company.legalAgent,
          address: company.address,
          phone: company.phone,
          email: company.email,
          urlIcon: company.urlIcon,
          numberOfEmployees: company.numberOfEmployees,
        });
      }
    });

    return res
      .status(200)
      .json({ companies: Array.from(uniqueCompanies.values()) });
  } catch (error) {
    console.error("Error al obtener las empresas:", error);
    return res.status(500).json({
      message: "Error interno del servidor.",
      error: error.message,
    });
  }
};

export const deleteCompany = async (req, res) => {
  const { id } = req.params;

  try {
    const company = await models.Company.findByPk(id);

    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }
    await models.UserCompany.destroy({
      where: { companyId: id },
    });

    await company.destroy();

    res.status(200).json({ message: "Company deleted successfully." });
  } catch (error) {
    console.error("Error deleting company:", error);
    res.status(500).json({ message: "Error deleting company.", error });
  }
};

export const getCompanyById = async (req, res) => {
  const { id } = req.params;
  try {
    const company = await models.Company.findByPk(id);
    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }
    return res.status(200).json(company);
  } catch (error) {
    console.error("Error al obtener la empresa:", error);
    return res.status(500).json({
      message: "Error interno del servidor.",
      error: error.message,
    });
  }
};

export const getSurveysByCompany = async (req, res) => {
  const { id } = req.params;
  const { specialistId } = req.body;

  if (!specialistId) {
    return res
      .status(400)
      .json({ message: "El ID del especialista es requerido." });
  }

  try {
    const company = await models.Company.findByPk(id);

    if (!company) {
      return res.status(404).json({ message: "Empresa no encontrada." });
    }

    // Verificar si el especialista está asociado a la empresa
    const specialistCompany = await models.UserCompany.findOne({
      where: { companyId: id, userId: specialistId },
    });

    if (!specialistCompany) {
      return res
        .status(403)
        .json({ message: "No tienes permisos para ver estas encuestas." });
    }

    // Obtener encuestas de la empresa
    const surveys = await models.SurveyAssignment.findAll({
      include: [
        {
          model: models.UserCompany,
          where: { companyId: id },
        },
      ],
    });

    return res.status(200).json(surveys);
  } catch (error) {
    console.error("Error al obtener las encuestas de la empresa:", error);
    return res.status(500).json({
      message: "Error interno del servidor.",
      error: error.message,
    });
  }
};

export const updateCompany = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    legalAgent,
    nitCompany,
    address,
    phone,
    email,
    numberOfEmployees,
  } = req.body;

  try {
    // Buscar la empresa por ID
    const company = await models.Company.findByPk(id);

    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }

    // Crear un objeto con los campos que han cambiado
    const updates = {};

    // Comparar cada campo recibido con el valor actual y solo incluir los que han cambiado
    if (name !== undefined && name !== company.name) {
      updates.name = name;
    }
    if (legalAgent !== undefined && legalAgent !== company.legalAgent) {
      updates.legalAgent = legalAgent;
    }
    if (nitCompany !== undefined && nitCompany !== company.nitCompany) {
      updates.nitCompany = nitCompany;
    }
    if (address !== undefined && address !== company.address) {
      updates.address = address;
    }
    if (phone !== undefined && phone !== company.phone) {
      updates.phone = phone;
    }
    if (email !== undefined && email !== company.email) {
      updates.email = email;
    }
    if (
      numberOfEmployees !== undefined &&
      numberOfEmployees !== company.numberOfEmployees
    ) {
      updates.numberOfEmployees = numberOfEmployees;
    }

    // Si no hay cambios, devolver un mensaje indicando que no se realizaron actualizaciones
    if (Object.keys(updates).length === 0) {
      return res.status(200).json({
        message: "No changes detected.",
        company,
      });
    }

    // Actualizar solo los campos que han cambiado
    await company.update(updates);

    // Recargar el objeto para asegurarnos de que devolvemos los datos actualizados
    await company.reload();

    return res.status(200).json({
      message: "Company updated successfully.",
      company,
    });
  } catch (error) {
    console.error("Error updating company:", error);
    return res.status(500).json({
      message: "Error updating company.",
      error: error.message,
    });
  }
};

export const getUsersByCompany = async (req, res) => {
  const { id } = req.params;
  const { specialistId } = req.body;

  if (!specialistId) {
    return res
      .status(400)
      .json({ message: "El ID del especialista es requerido." });
  }

  try {
    const company = await models.Company.findByPk(id);

    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }

    // Verificar si el especialista está asociado a la empresa
    const specialistCompany = await models.UserCompany.findOne({
      where: { companyId: id, userId: specialistId },
    });

    if (!specialistCompany) {
      return res
        .status(403)
        .json({ message: "No tienes permisos para ver estos usuarios." });
    }

    // Obtener usuarios de la empresa
    const users = await models.UserCompany.findAll({
      where: { companyId: id },
      attributes: ["id", "companyId", "specialistId"],
      include: [
        {
          model: models.User,
          as: "user", 
          include: [
            {
              model: models.People,
              as: "people",
              attributes: ["id", "names", "surNames", "phone", "email"],
            },
          ],
          attributes: ["id", "numberDoc"],
        },
      ],
    });

    console.log(users);

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener los usuarios de la empresa:", error);
    return res.status(500).json({
      message: "Error interno del servidor.",
      error: error.message,
    });
  }
};

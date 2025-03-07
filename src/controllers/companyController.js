// controllers/companyController.js
import { models } from "../database/conexion.js";
import {
  AUX_URL
} from "../config/index.js";

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
    if (!id || !specialistId || !nameCompany || !legalAgent || !numberOfEmployees || !nitCompany) {
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
      attributes: ["id", "specialistId"],
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
      order: [["createdAt", "DESC"]],
    });

    const formattedCompanies = companies.map(
      ({ id, specialistId, company }) => ({
        id,
        specialistId,
        companyId: company.id,
        name: company.name,
        nitCompany: company.nitCompany,
        legalAgent: company.legalAgent,
        address: company.address,
        phone: company.phone,
        email: company.email,
        urlIcon: company.urlIcon,
        numberOfEmployees: company.numberOfEmployees,
      })
    );

    return res.status(200).json({ companies: formattedCompanies });
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
  

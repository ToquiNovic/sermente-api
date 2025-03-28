// controllers/userCompanyController.js
import { models } from "../database/conexion.js";

export const assignUsersToCompany = async (req, res) => {
  const { id } = req.params;
  const usersData = req.body;

  try {
    const company = await models.Company.findByPk(id);
    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }

    const assignedUsers = [];
    const skippedUsers = [];

    for (const userData of usersData) {
      const { email, names, surNames, document, contractType, hierarchyOfEmployment } = userData;

      let user = await models.User.findOne({ where: { email } });

      if (!user) {
        user = await models.User.create({
          email,
          names,
          surNames,
          document,
          contractType,
          hierarchyOfEmployment,
        });
      }

      const userCompany = await models.UserCompany.findOne({
        where: { companyId: id, userId: user.id },
      });

      if (userCompany) {
        skippedUsers.push(email);
      } else {
        await models.UserCompany.create({ userId: user.id, companyId: id });
        assignedUsers.push(email);
      }
    }

    return res.status(201).json({
      message: "Users processed successfully.",
      assignedUsers,
      skippedUsers,
    });
  } catch (error) {
    console.error("Error assigning users to company:", error);
    return res.status(500).json({ message: "Error assigning users to company.", error });
  }
};

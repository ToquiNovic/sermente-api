import { models } from "../database/conexion.js";

// Utilidades auxiliares
const findOrCreateByName = async (Model, name, defaultName) => {
  const finalName = name?.trim() || defaultName;
  const [record] = await Model.findOrCreate({
    where: { name: finalName },
    defaults: { name: finalName },
  });
  return record;
};

const createOrUpdatePerson = async (userData, contract, hierarchy) => {
  const { email, names, surNames, phone, dependency, positionCompany } =
    userData;
  return await models.People.findOrCreate({
    where: { email: email.trim() },
    defaults: {
      names: names?.trim() || "",
      surNames: surNames?.trim() || "",
      email: email.trim(),
      phone: phone?.trim() || "",
      dependency: dependency?.trim() || "",
      positionCompany: positionCompany?.trim() || "",
      contractTypeId: contract.id,
      hierarchyOfEmploymentId: hierarchy.id,
    },
  });
};

const createOrUpdateUser = async (doc, personId) => {
  const [user, created] = await models.User.findOrCreate({
    where: { numberDoc: doc },
    defaults: { numberDoc: doc, peopleId: personId },
  });

  if (created) {
    const [role] = await models.Role.findOrCreate({
      where: { name: "Encuestado" },
      defaults: { name: "Encuestado", state: true },
    });
    await models.UserRole.create({ userId: user.id, roleId: role.id });
  } else if (!user.peopleId) {
    await user.update({ peopleId: personId });
  }

  return user;
};

const assignUserToCompany = async (userId, companyId) => {
  const alreadyAssigned = await models.UserCompany.findOne({
    where: { userId, companyId },
  });

  if (!alreadyAssigned) {
    await models.UserCompany.create({ userId, companyId });
    return true;
  }
  return false;
};

// Controlador principal
export const assignUsersToCompany = async (req, res) => {
  try {
    const { id: companyId } = req.params;
    const { users } = req.body;

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({
        message: "Invalid input: 'users' must be a non-empty array.",
      });
    }

    const company = await models.Company.findByPk(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }

    const assignedUsers = [];
    const skippedUsers = [];

    for (const userData of users) {
      try {
        const { email, numberDoc } = userData;

        if (!email?.trim() || !numberDoc?.trim()) {
          skippedUsers.push(email || "Documento sin email");
          continue;
        }

        const emailTrimmed = email.trim();
        const docTrimmed = numberDoc.trim();

        const contract = await findOrCreateByName(
          models.ContractType,
          userData.contractType,
          "No especificado"
        );

        const hierarchy = await findOrCreateByName(
          models.HierarchyOfEmployment,
          userData.hierarchyOfEmployment,
          "Sin especificar"
        );

        const [person] = await createOrUpdatePerson(
          userData,
          contract,
          hierarchy
        );
        const user = await createOrUpdateUser(docTrimmed, person.id);
        const wasAssigned = await assignUserToCompany(user.id, companyId);

        wasAssigned
          ? assignedUsers.push(emailTrimmed)
          : skippedUsers.push(emailTrimmed);
      } catch (userError) {
        console.error("Error procesando usuario:", userData.email, userError);
        skippedUsers.push(userData.email || "Usuario desconocido");
      }
    }

    return res.status(201).json({
      message: "Users processed successfully.",
      assignedUsers,
      skippedUsers,
    });
  } catch (error) {
    console.error("Error assigning users to company:", error);
    return res.status(500).json({
      message: "Error assigning users to company.",
      error: error.message,
    });
  }
};

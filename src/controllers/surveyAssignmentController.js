import { models } from "../database/conexion.js";

export const createUserWithPeople = async (req, res) => {
  try {
    const usersData = req.body;

    if (!Array.isArray(usersData) || usersData.length === 0) {
      return res.status(400).json({ message: "El cuerpo de la solicitud debe ser un array con datos de usuarios." });
    }

    const createdUsers = [];

    for (const data of usersData) {
      const { survey, names, surNames, email, phone, dependency, positionCompany, numberDoc, contractType, hierarchyOfEmployment } = data;

      // **Buscar o crear ContractType**
      let contract = null;
      if (contractType) {
        [contract] = await models.ContractType.findOrCreate({
          where: { name: contractType },
        });
      }

      // **Buscar o crear HierarchyOfEmployment**
      let hierarchy = null;
      if (hierarchyOfEmployment) {
        [hierarchy] = await models.HierarchyOfEmployment.findOrCreate({
          where: { name: hierarchyOfEmployment },
        });
      }

      // **Crear People**
      const people = await models.People.create({
        names,
        surNames,
        email,
        phone,
        dependency,
        positionCompany,
        contractTypeId: contract ? contract.id : null,
        hierarchyOfEmploymentId: hierarchy ? hierarchy.id : null,
      });

      // **Crear User**
      const user = await models.User.create({
        numberDoc,
        peopleId: people.id,
        state: "active",
      });

      // **Asignar rol de Encuestado**
      const role = await models.Role.findOne({ where: { name: "Encuestado" } });
      if (role) {
        await models.UserRole.create({
          userId: user.id,
          roleId: role.id,
        });
      }

      createdUsers.push({ survey, user, people, contract, hierarchy });
    }

    return res.status(201).json({ message: "Usuarios creados exitosamente", users: createdUsers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al crear usuarios y personas", error });
  }
};

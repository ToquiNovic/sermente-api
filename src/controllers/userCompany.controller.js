import { models } from "../database/conexion.js";

export const assignUsersToCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { users } = req.body;

    console.log("users", users);

    if (!Array.isArray(users) || users.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid input: 'users' must be a non-empty array." });
    }

    const company = await models.Company.findByPk(id);
    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }

    const assignedUsers = [];
    const skippedUsers = [];

    for (const userData of users) {
      try {
        const {
          email,
          names,
          surNames,
          numberDoc,
          phone,
          contractType,
          hierarchyOfEmployment,
          dependency,
          positionCompany,
        } = userData;

        if (!email?.trim() || !numberDoc?.trim()) {
          console.warn(`Usuario omitido: falta email o documento.`, userData);
          skippedUsers.push(email || "Documento sin email");
          continue;
        }

        const emailTrimmed = email.trim();
        const documentTrimmed = numberDoc.trim();

        console.log(
          `\nProcesando usuario: ${emailTrimmed}, Documento: ${documentTrimmed}`
        );

        // Buscar o crear la jerarquía laboral
        const [hierarchy] = await models.HierarchyOfEmployment.findOrCreate({
          where: { name: hierarchyOfEmployment?.trim() || "Sin especificar" },
          defaults: {
            name: hierarchyOfEmployment?.trim() || "Sin especificar",
          },
        });

        // Buscar o crear el tipo de contrato
        const [contract] = await models.ContractType.findOrCreate({
          where: { name: contractType?.trim() || "No especificado" },
          defaults: { name: contractType?.trim() || "No especificado" },
        });

        // Buscar o crear la persona en 'People'
        const [person] = await models.People.findOrCreate({
          where: { email: emailTrimmed },
          defaults: {
            names: names?.trim() || "",
            surNames: surNames?.trim() || "",
            email: emailTrimmed,
            phone: phone?.trim() || "",
            dependency: dependency?.trim() || "",
            positionCompany: positionCompany?.trim() || "",
            contractTypeId: contract.id,
            hierarchyOfEmploymentId: hierarchy.id,
          },
        });

        console.log("Persona creada/encontrada:", person.id);

        // Buscar o crear el usuario en 'User' y asignarle el peopleId de inmediato
        const [user, created] = await models.User.findOrCreate({
          where: { numberDoc: documentTrimmed },
          defaults: {
            numberDoc: documentTrimmed,
            peopleId: person.id,
          },
        });

        if (created) {
          console.log(`Usuario creado con documento ${documentTrimmed}`);

          // Asignar el rol "Encuestado"
          const [role] = await models.Role.findOrCreate({
            where: { name: "Encuestado" },
            defaults: { name: "Encuestado", state: true },
          });

          await models.UserRole.create({
            userId: user.id,
            roleId: role.id,
          });
        } else if (!user.peopleId) {
          await user.update({ peopleId: person.id });
        }

        // Verificar si ya está asignado a la empresa
        const userCompany = await models.UserCompany.findOne({
          where: { companyId: id, userId: user.id },
        });

        if (userCompany) {
          console.log(`Usuario ${emailTrimmed} ya está asignado a la empresa.`);
          skippedUsers.push(emailTrimmed);
        } else {
          await models.UserCompany.create({ userId: user.id, companyId: id });
          assignedUsers.push(emailTrimmed);
        }
      } catch (userError) {
        console.error("Error procesando usuario:", userData, userError);
        skippedUsers.push(userData.email || "Usuario desconocido");
      }
    }

    console.log("\nUsuarios asignados correctamente:", assignedUsers);
    console.log("Usuarios omitidos:", skippedUsers);

    return res.status(201).json({
      message: "Users processed successfully.",
      assignedUsers,
      skippedUsers,
    });
  } catch (error) {
    console.error("Error assigning users to company:", error);
    return res
      .status(500)
      .json({ message: "Error assigning users to company.", error: error.message });
  }
};

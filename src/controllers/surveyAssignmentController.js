import { models, sequelize } from "../database/conexion.js";

export const assignUsersToSurvey = async (req, res) => {
  const { companyId } = req.params;
  const { users, deadline } = req.body;
  try {
    // Validation User
    if (!users || users.length === 0)
      return res
        .status(400)
        .json({ message: "Invalid input: 'users' must be a non-empty array." });

    // Assignments
    const result = await sequelize.transaction(async (transaction) => {
      // Validation Company
      const company = await models.Company.findByPk(companyId);
      if (!company)
        return res.status(404).json({ message: "La empresa no existe." });

      // Surveys available
      const Surveys = await models.Survey.findAll();

      if (!Surveys || Surveys.length === 0)
        return res
          .status(404)
          .json({ message: "No surveys found for this company." });

      const socioEconomica = Surveys.find(
        (s) => s.title === "Encuesta Socioeconómica"
      );

      const encuestaFormaA = Surveys.find(
        (s) => s.title === "Encuesta Forma A"
      );

      const encuestaFormaB = Surveys.find(
        (s) => s.title === "Encuesta Forma B"
      );

      // Validar que todas las encuestas existan
      if (!socioEconomica)
        return res
          .status(404)
          .json({ message: "Encuesta Socioeconómica no encontrada." });

      if (!encuestaFormaA)
        return res
          .status(404)
          .json({ message: "Encuesta Forma A no encontrada." });

      if (!encuestaFormaB)
        return res
          .status(404)
          .json({ message: "Encuesta Forma B no encontrada." });

      // People Data
      const userIds = users.map((user) => user.id);
      const peopleData = await models.User.findAll({
        where: {
          id: userIds,
        },
        attributes: ["id"],
        include: [
          {
            model: models.People,
            as: "people",
            attributes: ["id", "names", "hierarchyOfEmploymentId"],
            include: [
              {
                model: models.HierarchyOfEmployment,
                as: "hierarchyOfEmployment",
                attributes: ["id", "name"],
                required: false,
              },
            ],
          },
        ],
      });

      console.log(
        "peopleData",
        peopleData.map((user) => ({
          userId: user.id,
          peopleId: user.people?.id,
          peopleNames: user.people?.names,
          hierarchyOfEmployment:
            user.people?.hierarchyOfEmployment?.name || null,
        }))
      );

      // User Companies
      const userCompanies = await models.UserCompany.findAll({
        where: {
          userId: userIds,
          companyId,
        },
        attributes: ["id", "companyId", "userId"],
      });

      if (!userCompanies || userCompanies.length === 0)
        return res
          .status(404)
          .json({ message: "No users found for this company." });

      // Crear mapa para relacionar userId con userCompanyId
      const userCompanyMap = {};
      userCompanies.forEach((uc) => {
        userCompanyMap[uc.userId] = uc.id;
      });

      // Obtener todas las asignaciones existentes para estos usuarios
      const userCompanyIds = Object.values(userCompanyMap);
      const existingAssignments = await models.SurveyAssignment.findAll({
        where: {
          userCompanyId: userCompanyIds,
        },
        attributes: ["surveyId", "userCompanyId"],
      });

      // Crear un Set para búsqueda rápida de asignaciones existentes
      const existingAssignmentsSet = new Set(
        existingAssignments.map(
          (assignment) => `${assignment.surveyId}-${assignment.userCompanyId}`
        )
      );

      console.log("Existing assignments found:", existingAssignments.length);

      // Crear asignaciones múltiples según jerarquía
      const assignmentsData = [];
      const skippedAssignments = [];

      peopleData.forEach((userData) => {
        const userCompanyId = userCompanyMap[userData.id];
        if (userCompanyId) {
          const hierarchyName = userData.people?.hierarchyOfEmployment?.name;
          const userName = userData.people?.names || "Usuario desconocido";

          // 1. Verificar y asignar Encuesta Socioeconómica a TODOS
          const socioKey = `${socioEconomica.id}-${userCompanyId}`;
          if (!existingAssignmentsSet.has(socioKey)) {
            assignmentsData.push({
              surveyId: socioEconomica.id,
              userCompanyId: userCompanyId,
              deadline: deadline || null,
              completed: false,
            });
          } else {
            skippedAssignments.push({
              survey: "Encuesta Socioeconómica",
              user: userName,
              reason: "Ya asignada",
            });
          }

          // 2. Asignar encuesta específica según jerarquía
          let specificSurvey;
          let specificSurveyName;

          if (hierarchyName === "PROFESIONAL" || hierarchyName === "TECNICO") {
            specificSurvey = encuestaFormaA;
            specificSurveyName = "Encuesta Forma A";
          } else {
            specificSurvey = encuestaFormaB;
            specificSurveyName = "Encuesta Forma B";
          }

          const specificKey = `${specificSurvey.id}-${userCompanyId}`;
          if (!existingAssignmentsSet.has(specificKey)) {
            assignmentsData.push({
              surveyId: specificSurvey.id,
              userCompanyId: userCompanyId,
              deadline: deadline || null,
              completed: false,
            });
          } else {
            skippedAssignments.push({
              survey: specificSurveyName,
              user: userName,
              reason: "Ya asignada",
            });
          }
        }
      });

      console.log("New assignments to create:", assignmentsData.length);
      console.log("Skipped assignments:", skippedAssignments.length);

      console.log(
        "Assignment details:",
        assignmentsData.map((assignment) => {
          const survey = Surveys.find((s) => s.id === assignment.surveyId);
          const userData = peopleData.find(
            (u) => userCompanyMap[u.id] === assignment.userCompanyId
          );
          return {
            surveyTitle: survey?.title || "Unknown",
            userName: userData?.people?.names || "Unknown",
            userHierarchy:
              userData?.people?.hierarchyOfEmployment?.name || "Sin jerarquía",
            userCompanyId: assignment.userCompanyId,
          };
        })
      );

      // Solo crear asignaciones si hay nuevas asignaciones
      if (assignmentsData.length === 0) {
        return {
          success: true,
          message:
            "No hay nuevas asignaciones para crear. Todas las encuestas ya están asignadas.",
          newAssignments: 0,
          existingAssignments: existingAssignments.length,
          skippedAssignments: skippedAssignments,
          assignments: [],
        };
      }

      // Crear todas las asignaciones nuevas en una sola operación
      const createdAssignments = await models.SurveyAssignment.bulkCreate(
        assignmentsData,
        {
          transaction,
          ignoreDuplicates: true, // Por si acaso hay duplicados
        }
      );

      return {
        success: true,
        message: "Encuestas procesadas exitosamente.",
        newAssignments: createdAssignments.length,
        existingAssignments: existingAssignments.length,
        skippedAssignments: skippedAssignments,
        assignments: createdAssignments,
      };
    });

    // Respuesta final
    res.status(201).json({
      message: result.message,
      summary: {
        totalUsers: users.length,
        newAssignments: result.newAssignments,
        existingAssignments: result.existingAssignments,
        skippedAssignments: result.skippedAssignments?.length || 0,
      },
      details: {
        assignments: result.assignments,
        skipped: result.skippedAssignments,
      },
    });
  } catch (error) {
    console.error("Error al asignar usuarios a la encuesta:", error);
    return res.status(500).json({
      message: "Error al asignar usuarios a la encuesta.",
      error: error.message,
    });
  }
};

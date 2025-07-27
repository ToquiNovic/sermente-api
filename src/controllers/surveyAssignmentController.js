import { models } from "../database/conexion.js";
// Aqui modificar lo de asignar encuentas a un usuario, tener en cuenta el nivel gerarquico de la empresa 
export const assignSurveyToUser = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { userCompanyId, deadline, reportId } = req.body;

    if (
      !companyId ||
      typeof companyId !== "string" ||
      companyId.trim() === ""
    ) {
      return res
        .status(400)
        .json({ message: "companyId inválido o faltante." });
    }

    if (!userCompanyId || !reportId) {
      return res
        .status(400)
        .json({ message: "userCompanyId y reportId son requeridos." });
    }

    // Verificar que la empresa exista
    const company = await models.Company.findByPk(companyId);
    if (!company) {
      return res.status(404).json({ message: "La empresa no existe." });
    }

    // Verificar que el usuario pertenezca a la empresa
    const userCompany = await models.UserCompany.findOne({
      where: {
        id: userCompanyId,
        companyId,
      },
    });

    if (!userCompany) {
      return res
        .status(404)
        .json({ message: "El usuario no pertenece a esta empresa." });
    }

    // Verificar que la encuesta (reporte) exista
    const report = await models.Report.findCreateFindByPk();
    if (!report) {
      return res
        .status(404)
        .json({ message: "La encuesta (report) no existe." });
    }

    // Crear la asignación
    const assignment = await models.SurveyAssignment.create({
      userCompanyId,
      reportId: report.id,
      deadline: deadline || null,
      completed: false,
    });

    return res.status(201).json({
      message: "Encuesta asignada exitosamente al usuario.",
      assignment,
    });
  } catch (error) {
    console.error("Error al asignar la encuesta:", error);
    return res
      .status(500)
      .json({ message: "Error interno al asignar la encuesta." });
  }
};

// export const assignUsersToSurvey = async (req, res) => {
//   const { }
//   try {

//   } catch (error) {
//     return res.status(500).json({
//       message: "Error al asignar usuarios a la encuesta.", 
//       error: error.message,
//     });
//   }
// }
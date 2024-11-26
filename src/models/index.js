// models/index.js
import People from "./people.js";
import Gender from "./gender.js";
import Stratum from "./stratum.js";
import LevelOfStudy from "./levelofStudy.js";
import HousingType from "./housingType.js";
import ContractType from "./contractType.js";
import SalaryType from "./salaryType.js";
import MaritalStatus from "./maritalStatus.js";
import TypeDocument from "./typeDocument.js";
import User from "./user.js";
import Survey from "./survey.js";
import Question from "./question.js";
import EvaluationCriteria from "./evaluationCriteria.js";
import Category from "./Category.js";
import SubCategory from "./subcategory.js";
import TypeSurveys from "./typeSurveys.js";
import Role from "./Role.js";
import SurveyAssignment from "./surveyAssignment.js";
import Dependency from "./Dependency.js";

export default (sequelize) => {
  const models = {
    People: People(sequelize),
    Gender: Gender(sequelize),
    Stratum: Stratum(sequelize),
    LevelOfStudy: LevelOfStudy(sequelize),
    HousingType: HousingType(sequelize),
    ContractType: ContractType(sequelize),
    SalaryType: SalaryType(sequelize),
    MaritalStatus: MaritalStatus(sequelize),
    TypeDocument: TypeDocument(sequelize),
    User: User(sequelize),
    Survey: Survey(sequelize),
    Question: Question(sequelize),
    EvaluationCriteria: EvaluationCriteria(sequelize),
    Category: Category(sequelize),
    SubCategory: SubCategory(sequelize),
    TypeSurveys: TypeSurveys(sequelize),
    Role: Role(sequelize),
    SurveyAssignment: SurveyAssignment(sequelize),
    Dependency: Dependency(sequelize),
  };

  // Definir relaciones
  models.Gender.hasMany(models.People, {
    foreignKey: "genderId",
    as: "people",
  });
  models.People.belongsTo(models.Gender, {
    foreignKey: "genderId",
    as: "gender",
  });

  models.Stratum.hasMany(models.People, {
    foreignKey: "stratumId",
    as: "people",
  });
  models.People.belongsTo(models.Stratum, {
    foreignKey: "stratumId",
    as: "stratum",
  });

  models.LevelOfStudy.hasMany(models.People, {
    foreignKey: "levelOfStudyId",
    as: "people",
  });
  models.People.belongsTo(models.LevelOfStudy, {
    foreignKey: "levelOfStudyId",
    as: "levelOfStudy",
  });

  models.HousingType.hasMany(models.People, {
    foreignKey: "housingTypeId",
    as: "people",
  });
  models.People.belongsTo(models.HousingType, {
    foreignKey: "housingTypeId",
    as: "housingType",
  });

  models.ContractType.hasMany(models.People, {
    foreignKey: "contractTypeId",
    as: "people",
  });
  models.People.belongsTo(models.ContractType, {
    foreignKey: "contractTypeId",
    as: "contractType",
  });

  models.SalaryType.hasMany(models.People, {
    foreignKey: "salaryTypeId",
    as: "people",
  });
  models.People.belongsTo(models.SalaryType, {
    foreignKey: "salaryTypeId",
    as: "salaryType",
  });

  models.MaritalStatus.hasMany(models.People, {
    foreignKey: "maritalStatusId",
    as: "people",
  });
  models.People.belongsTo(models.MaritalStatus, {
    foreignKey: "maritalStatusId",
    as: "maritalStatus",
  });

  models.TypeDocument.hasMany(models.People, {
    foreignKey: "typeDocumentId",
    as: "people",
  });
  models.People.belongsTo(models.TypeDocument, {
    foreignKey: "typeDocumentId",
    as: "typeDocument",
  });

  models.People.hasOne(models.User, { foreignKey: "peopleId", as: "user" });
  models.User.belongsTo(models.People, {
    foreignKey: "peopleId",
    as: "people",
  });

  models.TypeSurveys.hasMany(models.Survey, {
    foreignKey: "typeSurveyId",
    as: "surveys",
  });
  models.Survey.belongsTo(models.TypeSurveys, {
    foreignKey: "typeSurveyId",
    as: "typeSurvey",
  });

  models.Survey.hasMany(models.Category, {
    foreignKey: "surveyId",
    as: "categories",
  });

  models.Survey.belongsToMany(models.Dependency, {
    through: "SurveyDependencies",
    foreignKey: "surveyId",
    as: "dependencies",
  });
  models.Dependency.belongsToMany(models.Survey, {
    through: "SurveyDependencies",
    foreignKey: "dependencyId",
    as: "surveys",
  });

  // Relación entre SurveyAssignment y Dependency
  models.Dependency.hasMany(models.SurveyAssignment, {
    foreignKey: "dependencyId",
    as: "assignments",
  });
  models.SurveyAssignment.belongsTo(models.Dependency, {
    foreignKey: "dependencyId",
    as: "dependency",
  });

  models.Role.hasMany(models.User, { foreignKey: "roleId", as: "users" });
  models.User.belongsTo(models.Role, { foreignKey: "roleId", as: "role" });

  models.User.hasMany(models.Survey, {
    foreignKey: "createdBy",
    as: "createdSurveys",
  });
  models.Survey.belongsTo(models.User, {
    foreignKey: "createdBy",
    as: "creator",
  });

  models.Survey.belongsToMany(models.User, {
    through: models.SurveyAssignment,
    foreignKey: "surveyId",
    as: "assignedUsers",
  });
  models.User.belongsToMany(models.Survey, {
    through: models.SurveyAssignment,
    foreignKey: "userId",
    as: "assignedSurveys",
  });

  models.Category.belongsTo(models.Survey, {
    foreignKey: "surveyId",
    as: "survey",
  });

  models.Category.hasMany(models.SubCategory, {
    foreignKey: "categoryId",
    as: "subcategories",
  });
  models.SubCategory.belongsTo(models.Category, {
    foreignKey: "categoryId",
    as: "category",
  });

  models.SubCategory.hasMany(models.Question, {
    foreignKey: "subcategoryId",
    as: "questions",
  });
  models.Question.belongsTo(models.SubCategory, {
    foreignKey: "subcategoryId",
    as: "subcategory",
  });

  models.Question.hasMany(models.EvaluationCriteria, {
    foreignKey: "questionId",
    as: "criteria",
  });
  models.EvaluationCriteria.belongsTo(models.Question, {
    foreignKey: "questionId",
    as: "question",
  });

  return models;
};

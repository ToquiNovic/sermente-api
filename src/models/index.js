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
import Category from "./Category.js";
import SubCategory from "./subcategory.js";
import Role from "./Role.js";
import SurveyAssignment from "./surveyAssignment.js";
import Option from "./option.js";
import Answer from "./answer.js";
import UserRole from "./UserRoles.js";
import Profession from "./profession.js";
import HierarchyOfEmployment from "./hierarchyofEmployment.js";
import Company from "./company.js";
import UserCompany from "./UserCompany.js";
import AnswerOption from "./answerOption.js";
import Report from "./report.js";
import Economy from "./Economy.js";
import EconomyConfig from "./EconomyConfig.js";

export default (sequelize) => {
  const models = {
    Gender: Gender(sequelize),
    MaritalStatus: MaritalStatus(sequelize),
    ContractType: ContractType(sequelize),
    SalaryType: SalaryType(sequelize),
    LevelOfStudy: LevelOfStudy(sequelize),
    HousingType: HousingType(sequelize),
    Stratum: Stratum(sequelize),
    TypeDocument: TypeDocument(sequelize),
    People: People(sequelize),
    Profession: Profession(sequelize),
    Answer: Answer(sequelize),
    SubCategory: SubCategory(sequelize),
    Category: Category(sequelize),
    SurveyAssignment: SurveyAssignment(sequelize),
    UserRole: UserRole(sequelize),
    Role: Role(sequelize),
    User: User(sequelize),
    Survey: Survey(sequelize),
    Question: Question(sequelize),
    Option: Option(sequelize),
    HierarchyOfEmployment: HierarchyOfEmployment(sequelize),
    Company: Company(sequelize),
    UserCompany: UserCompany(sequelize),
    AnswerOption: AnswerOption(sequelize),
    Report: Report(sequelize),
    Economy: Economy(sequelize),
    EconomyConfig: EconomyConfig(sequelize),
  };

  // Relacionar Economy y User
  models.Economy.belongsTo(models.User, {
    foreignKey: "userId",
    as: "user",
  });

  models.User.hasMany(models.Economy, {
    foreignKey: "userId",
    as: "economies",
  });

  // Relacionar EconomyConfig y Economy
  models.EconomyConfig.hasOne(models.Economy, {
    foreignKey: "economyConfigId",
    as: "economyConfig",
  });

  models.Economy.belongsTo(models.EconomyConfig, {
    foreignKey: "economyConfigId",
    as: "economyConfig",
  });

  // Relacionar AnswerOption y Answer
  models.Answer.hasMany(models.AnswerOption, {
    foreignKey: "answerId",
    as: "answerOptions",
  });

  models.AnswerOption.belongsTo(models.Answer, {
    foreignKey: "answerId",
    as: "answer",
  });

  // Relacionar AnswerOption y Option
  models.Option.hasMany(models.AnswerOption, {
    foreignKey: "optionId",
    as: "answerOptions",
  });
  models.AnswerOption.belongsTo(models.Option, {
    foreignKey: "optionId",
    as: "option",
  });

  // Relacionar UserCompany y User
  models.User.hasMany(models.UserCompany, {
    foreignKey: "userId",
    as: "UserCompanies",
  });
  models.UserCompany.belongsTo(models.User, {
    foreignKey: "userId",
    as: "user",
  });

  // Relacionar UserCompany y Company
  models.Company.hasMany(models.UserCompany, {
    foreignKey: "companyId",
    as: "UserCompanies",
  });
  models.UserCompany.belongsTo(models.Company, {
    foreignKey: "companyId",
    as: "company",
  });

  // Relacionar People y Gender
  models.Gender.hasMany(models.People, {
    foreignKey: "genderId",
    as: "people",
  });
  models.People.belongsTo(models.Gender, {
    foreignKey: "genderId",
    as: "gender",
  });

  // Relacionar People y HierarchyOfEmployment
  models.HierarchyOfEmployment.hasMany(models.People, {
    foreignKey: "hierarchyOfEmploymentId",
    as: "people",
  });
  models.People.belongsTo(models.HierarchyOfEmployment, {
    foreignKey: "hierarchyOfEmploymentId",
    as: "hierarchyOfEmployment",
  });

  // Relacionar People y Stratum
  models.Stratum.hasMany(models.People, {
    foreignKey: "stratumId",
    as: "people",
  });
  models.People.belongsTo(models.Stratum, {
    foreignKey: "stratumId",
    as: "stratum",
  });

  // Relacionar People y LevelOfStudy
  models.LevelOfStudy.hasMany(models.People, {
    foreignKey: "levelOfStudyId",
    as: "people",
  });
  models.People.belongsTo(models.LevelOfStudy, {
    foreignKey: "levelOfStudyId",
    as: "levelOfStudy",
  });

  // Relacionar LevelOfStudy y Profession
  models.LevelOfStudy.hasMany(models.Profession, {
    foreignKey: "levelOfStudyId",
    as: "professions",
  });
  models.Profession.belongsTo(models.LevelOfStudy, {
    foreignKey: "levelOfStudyId",
    as: "LevelOfStudy",
  });

  // Relacionar People y HousingType
  models.HousingType.hasMany(models.People, {
    foreignKey: "housingTypeId",
    as: "people",
  });
  models.People.belongsTo(models.HousingType, {
    foreignKey: "housingTypeId",
    as: "housingType",
  });

  // Relacionar People y ContractType
  models.ContractType.hasMany(models.People, {
    foreignKey: "contractTypeId",
    as: "people",
  });
  models.People.belongsTo(models.ContractType, {
    foreignKey: "contractTypeId",
    as: "contractType",
  });

  // Relacionar People y SalaryType
  models.SalaryType.hasMany(models.People, {
    foreignKey: "salaryTypeId",
    as: "people",
  });
  models.People.belongsTo(models.SalaryType, {
    foreignKey: "salaryTypeId",
    as: "salaryType",
  });

  // Relacionar People y MaritalStatus
  models.MaritalStatus.hasMany(models.People, {
    foreignKey: "maritalStatusId",
    as: "people",
  });
  models.People.belongsTo(models.MaritalStatus, {
    foreignKey: "maritalStatusId",
    as: "maritalStatus",
  });

  // Relacionar People y TypeDocument
  models.TypeDocument.hasMany(models.People, {
    foreignKey: "typeDocumentId",
    as: "people",
  });
  models.People.belongsTo(models.TypeDocument, {
    foreignKey: "typeDocumentId",
    as: "typeDocument",
  });

  // Relacionar People y User
  models.People.hasOne(models.User, { foreignKey: "peopleId", as: "user" });
  models.User.belongsTo(models.People, {
    foreignKey: "peopleId",
    as: "people",
  });

  // Relacionar Role y User
  models.User.belongsToMany(models.Role, {
    through: models.UserRole,
    foreignKey: "userId",
    as: "roles",
  });

  models.Role.belongsToMany(models.User, {
    through: models.UserRole,
    foreignKey: "roleId",
    as: "users",
  });

  // Relacionar Survey y Category
  models.Category.belongsTo(models.Survey, {
    foreignKey: "surveyId",
    as: "survey",
  });

  models.Survey.hasMany(models.Category, {
    foreignKey: "surveyId",
    as: "categories",
  });

  // Relacionar Category y SubCategory
  models.Category.hasMany(models.SubCategory, {
    foreignKey: "categoryId",
    as: "subcategories",
  });
  models.SubCategory.belongsTo(models.Category, {
    foreignKey: "categoryId",
    as: "category",
  });

  // Relacionar SubCategory y Question
  models.SubCategory.hasMany(models.Question, {
    foreignKey: "subcategoryId",
    as: "questions",
  });
  models.Question.belongsTo(models.SubCategory, {
    foreignKey: "subcategoryId",
    as: "subcategory",
  });

  // Relacionar Question y Option
  models.Question.hasMany(models.Option, {
    foreignKey: "questionId",
    as: "options",
  });
  models.Option.belongsTo(models.Question, {
    foreignKey: "questionId",
    as: "question",
  });

  // Relacionar SurveyAssignment y UserCompany
  models.UserCompany.hasMany(models.SurveyAssignment, {
    foreignKey: "userCompanyId",
    as: "surveyAssignments",
  });
  models.SurveyAssignment.belongsTo(models.UserCompany, {
    foreignKey: "userCompanyId",
    as: "userCompany",
  });

  // Relacionar SurveyAssignment y AnswerOption
  models.AnswerOption.hasMany(models.SurveyAssignment, {
    foreignKey: "answerOptionId",
    as: "surveyAssignments",
  });

  models.SurveyAssignment.belongsTo(models.AnswerOption, {
    foreignKey: "answerOptionId",
    as: "answerOption",
  });

  // Relacionar SurveyAssignment y Report
  models.Report.hasMany(models.SurveyAssignment, {
    foreignKey: "reportId",
    as: "surveyAssignments",
  });
  models.SurveyAssignment.belongsTo(models.Report, {
    foreignKey: "reportId",
    as: "report",
  });

  return models;
};

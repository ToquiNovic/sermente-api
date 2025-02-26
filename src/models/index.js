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
import TypeSurveys from "./typeSurveys.js";
import Role from "./Role.js";
import SurveyAssignment from "./surveyAssignment.js";
import Dependency from "./Dependency.js";
import Option from "./option.js";
import Answer from "./answer.js";
import UserRole from "./UserRoles.js";

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
    Category: Category(sequelize),
    SubCategory: SubCategory(sequelize),
    TypeSurveys: TypeSurveys(sequelize),
    Role: Role(sequelize),
    SurveyAssignment: SurveyAssignment(sequelize),
    Dependency: Dependency(sequelize),
    Option: Option(sequelize),
    Answer: Answer(sequelize),
    UserRole: UserRole(sequelize),
  };

  // Relacionar People y Gender
  models.Gender.hasMany(models.People, {
    foreignKey: "genderId",
    as: "people",
  });
  models.People.belongsTo(models.Gender, {
    foreignKey: "genderId",
    as: "gender",
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

  // Relacionar TypeSurveys y Survey
  models.TypeSurveys.hasMany(models.Survey, {
    foreignKey: "typeSurveyId",
    as: "surveys",
  });
  models.Survey.belongsTo(models.TypeSurveys, {
    foreignKey: "typeSurveyId",
    as: "typeSurvey",
  });

  // Relacionar Survey y Category
  models.Survey.hasMany(models.Category, {
    foreignKey: "surveyId",
    as: "categories",
  });
  models.Category.belongsTo(models.Survey, {
    foreignKey: "surveyId",
    as: "survey",
  });

  // Relacionar Survey y Dependency (Many-to-Many)
  models.Survey.belongsToMany(models.Dependency, {
    through: { model: "SurveyDependencies" },
    foreignKey: "surveyId",
    otherKey: "dependencyId",
    as: "dependencies",
  });
  
  models.Dependency.belongsToMany(models.Survey, {
    through: { model: "SurveyDependencies" },
    foreignKey: "dependencyId",
    otherKey: "surveyId",
    as: "surveys",
  });  

  // Relacionar Dependency y SurveyAssignment
  models.Dependency.hasMany(models.SurveyAssignment, {
    foreignKey: "dependencyId",
    as: "assignments",
  });
  models.SurveyAssignment.belongsTo(models.Dependency, {
    foreignKey: "dependencyId",
    as: "dependency",
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
    
  // Relacionar User y Survey
  models.User.hasMany(models.Survey, {
    foreignKey: "createdBy",
    as: "createdSurveys",
  });
  models.Survey.belongsTo(models.User, {
    foreignKey: "createdBy",
    as: "creator",
  });

  // Relacionar Survey y User (Many-to-Many mediante SurveyAssignment)
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

  // Relacionar Option y Answer
  models.Option.hasMany(models.Answer, {
    foreignKey: "optionId",
    as: "answers",
  });
  models.Answer.belongsTo(models.Option, {
    foreignKey: "optionId",
    as: "option",
  });

  // Relacionar Question y Answer
  models.Question.hasMany(models.Answer, {
    foreignKey: "questionId",
    as: "answers",
  });
  models.Answer.belongsTo(models.Question, {
    foreignKey: "questionId",
    as: "question",
  });

  // Relacionar SurveyAssignment y Answer
  models.SurveyAssignment.hasMany(models.Answer, {
    foreignKey: "surveyAssignmentId",
    as: "answers",
  });
  models.Answer.belongsTo(models.SurveyAssignment, {
    foreignKey: "surveyAssignmentId",
    as: "surveyAssignment",
  });

  return models;
};

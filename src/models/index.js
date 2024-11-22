import People from './people.js';
import Gender from './gender.js';
import Stratum from './stratum.js';
import LevelOfStudy from './levelOfStudy.js';
import HousingType from './housingType.js';
import ContractType from './contractType.js';
import SalaryType from './salaryType.js';
import MaritalStatus from './maritalStatus.js';
import TypeDocument from './typeDocument.js';
import User from './user.js';
import survey from './survey.js';
import question from './question.js';
import evaluationCriteria from './evaluationCriteria.js';
import category from './category.js';
import subcategory from './subcategory.js';

export default (sequelize) => {
  // Inicializar modelos
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
    Survey: survey(sequelize),
    Question: question(sequelize),
    EvaluationCriteria: evaluationCriteria(sequelize),
    Category: category(sequelize),
    SubCategory: subcategory(sequelize),
  };

  // Definir relaciones
  models.Gender.hasMany(models.People, { foreignKey: 'genderId', as: 'people' });
  models.People.belongsTo(models.Gender, { foreignKey: 'genderId', as: 'gender' });

  models.Stratum.hasMany(models.People, { foreignKey: 'stratumId', as: 'people' });
  models.People.belongsTo(models.Stratum, { foreignKey: 'stratumId', as: 'stratum' });

  models.LevelOfStudy.hasMany(models.People, { foreignKey: 'levelOfStudyId', as: 'people' });
  models.People.belongsTo(models.LevelOfStudy, { foreignKey: 'levelOfStudyId', as: 'levelOfStudy' });

  models.HousingType.hasMany(models.People, { foreignKey: 'housingTypeId', as: 'people' });
  models.People.belongsTo(models.HousingType, { foreignKey: 'housingTypeId', as: 'housingType' });

  models.ContractType.hasMany(models.People, { foreignKey: 'contractTypeId', as: 'people' });
  models.People.belongsTo(models.ContractType, { foreignKey: 'contractTypeId', as: 'contractType' });

  models.SalaryType.hasMany(models.People, { foreignKey: 'salaryTypeId', as: 'people' });
  models.People.belongsTo(models.SalaryType, { foreignKey: 'salaryTypeId', as: 'salaryType' });

  models.MaritalStatus.hasMany(models.People, { foreignKey: 'maritalStatusId', as: 'people' });
  models.People.belongsTo(models.MaritalStatus, { foreignKey: 'maritalStatusId', as: 'maritalStatus' });

  models.TypeDocument.hasMany(models.People, { foreignKey: 'typeDocumentId', as: 'people' });
  models.People.belongsTo(models.TypeDocument, { foreignKey: 'typeDocumentId', as: 'typeDocument' });

  models.People.hasOne(models.User, { foreignKey: 'peopleId', as: 'user' });
  models.User.belongsTo(models.People, { foreignKey: 'peopleId', as: 'people' });

  models.Survey.hasMany(models.Category, { foreignKey: 'surveyId', as: 'categories' });
  models.Category.belongsTo(models.Survey, { foreignKey: 'surveyId', as: 'survey' });

  models.Category.hasMany(models.SubCategory, { foreignKey: 'categoryId', as: 'subcategories' });
  models.SubCategory.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });

  models.SubCategory.hasMany(models.Question, { foreignKey: 'subcategoryId', as: 'questions' });
  models.Question.belongsTo(models.SubCategory, { foreignKey: 'subcategoryId', as: 'subcategory' });

  models.Question.hasMany(models.EvaluationCriteria, { foreignKey: 'questionId', as: 'criteria' });
  models.EvaluationCriteria.belongsTo(models.Question, { foreignKey: 'questionId', as: 'question' });

  return models;
};

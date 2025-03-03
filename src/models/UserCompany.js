import { DataTypes } from "sequelize";

export default (sequelize) => {
  const UserCompany = sequelize.define(
    "UserCompany",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      companyId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      specialistId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      tableName: "user_companies",
      timestamps: true,
    }
  );

  // Hook antes de crear un UserCompany
  UserCompany.beforeCreate(async (userCompany, options) => {
    const { User, UserRole, Role } = sequelize.models;

    // Buscar un usuario con rol "Especialista" o "Administrador"
    const specialist = await User.findOne({
      include: [
        {
          model: UserRole,
          as: "roles",
          include: [
            {
              model: Role,
              as: "role",
              where: {
                name: ["Especialista", "Administrador"],
              },
            },
          ],
        },
      ],
    });

    if (specialist) {
      userCompany.specialistId = specialist.id;
    }
  });

  return UserCompany;
};

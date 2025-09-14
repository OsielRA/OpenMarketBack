import { CreationOptional, DataTypes, Model, Sequelize } from 'sequelize';

import { NewUserDTO, PrimitiveUser } from '../../shared/dto/user.dto';

export class User extends Model<PrimitiveUser, NewUserDTO> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare passwordHash: string;
  declare fullName: string;
  declare phone: string | null;
  declare role: 'customer' | 'creator' | 'admin';
  declare status: 'active' | 'suspended' | 'pending';
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initUserModel(sequelize: Sequelize) {
  User.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      email: { type: DataTypes.STRING, allowNull: false }, // CITEXT en DB
      passwordHash: { type: DataTypes.TEXT, allowNull: false, field: 'password_hash' },
      fullName: { type: DataTypes.STRING(150), allowNull: false, field: 'full_name' },
      phone: { type: DataTypes.STRING(30), allowNull: true },
      role: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'customer' },
      status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'active' },
      createdAt: { type: DataTypes.DATE, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
    },
    {
      sequelize,
      tableName: 'users',
      modelName: 'User',
      underscored: true,
      timestamps: true,
    },
  );
}

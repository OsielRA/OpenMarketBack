import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export class Brand extends Model<InferAttributes<Brand>, InferCreationAttributes<Brand>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare slug: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initBrandModel(sequelize: Sequelize) {
  Brand.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(120), allowNull: false },
      slug: { type: DataTypes.STRING(140), allowNull: false },
      createdAt: { type: DataTypes.DATE, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
    },
    { sequelize, tableName: 'brands', modelName: 'Brand', underscored: true, timestamps: true },
  );
}

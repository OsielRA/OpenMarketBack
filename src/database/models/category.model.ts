import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export class Category extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> {
  declare id: CreationOptional<number>;
  declare parentId: number | null;
  declare name: string;
  declare slug: string;
  declare position: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initCategoryModel(sequelize: Sequelize) {
  Category.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      parentId: { type: DataTypes.BIGINT, allowNull: true, field: 'parent_id' },
      name: { type: DataTypes.STRING(120), allowNull: false },
      slug: { type: DataTypes.STRING(140), allowNull: false },
      position: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      createdAt: { type: DataTypes.DATE, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
    },
    {
      sequelize,
      tableName: 'categories',
      modelName: 'Category',
      underscored: true,
      timestamps: true,
    },
  );
}

import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
  declare id: CreationOptional<number>;
  declare storeId: number;
  declare categoryId: number | null;
  declare brandId: number | null;
  declare title: string;
  declare slug: string;
  declare description: string | null;
  declare condition: 'new' | 'used' | 'refurbished';
  declare status: 'draft' | 'published' | 'archived';
  declare hasVariants: boolean;
  declare price: number | null;
  declare stockQty: number | null;
  declare currency: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initProductModel(sequelize: Sequelize) {
  Product.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      storeId: { type: DataTypes.BIGINT, allowNull: false, field: 'store_id' },
      categoryId: { type: DataTypes.BIGINT, allowNull: true, field: 'category_id' },
      brandId: { type: DataTypes.BIGINT, allowNull: true, field: 'brand_id' },
      title: { type: DataTypes.STRING(180), allowNull: false },
      slug: { type: DataTypes.STRING(200), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      condition: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'new' },
      status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'draft' },
      hasVariants: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'has_variants',
      },
      price: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
      stockQty: { type: DataTypes.INTEGER, allowNull: true, field: 'stock_qty' },
      currency: { type: DataTypes.STRING(3), allowNull: true },
      createdAt: { type: DataTypes.DATE, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
    },
    { sequelize, tableName: 'products', modelName: 'Product', underscored: true, timestamps: true },
  );
}

import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export class ProductVariant extends Model<
  InferAttributes<ProductVariant>,
  InferCreationAttributes<ProductVariant>
> {
  declare id: CreationOptional<number>;
  declare productId: number;
  declare sku: string;
  declare price: number;
  declare compareAtPrice: number | null;
  declare stockQty: number;
  declare barcode: string | null;
  declare weightGrams: number | null;
  declare lengthCm: number | null;
  declare widthCm: number | null;
  declare heightCm: number | null;
  declare isActive: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initProductVariantModel(sequelize: Sequelize) {
  ProductVariant.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      productId: { type: DataTypes.BIGINT, allowNull: false, field: 'product_id' },
      sku: { type: DataTypes.STRING(64), allowNull: false },
      price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      compareAtPrice: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
        field: 'compare_at_price',
      },
      stockQty: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'stock_qty' },
      barcode: { type: DataTypes.STRING(64), allowNull: true },
      weightGrams: { type: DataTypes.INTEGER, allowNull: true, field: 'weight_grams' },
      lengthCm: { type: DataTypes.DECIMAL(10, 2), allowNull: true, field: 'length_cm' },
      widthCm: { type: DataTypes.DECIMAL(10, 2), allowNull: true, field: 'width_cm' },
      heightCm: { type: DataTypes.DECIMAL(10, 2), allowNull: true, field: 'height_cm' },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
      },
      createdAt: { type: DataTypes.DATE, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
    },
    {
      sequelize,
      tableName: 'product_variants',
      modelName: 'ProductVariant',
      underscored: true,
      timestamps: true,
    },
  );
}

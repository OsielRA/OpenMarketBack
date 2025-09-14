import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize';

export class ProductVariantValue extends Model<
  InferAttributes<ProductVariantValue>,
  InferCreationAttributes<ProductVariantValue>
> {
  declare variantId: number;
  declare attributeId: number;
  declare attributeValueId: number;
}

export function initProductVariantValueModel(sequelize: Sequelize) {
  ProductVariantValue.init(
    {
      variantId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        field: 'variant_id',
      },
      attributeId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        field: 'attribute_id',
      },
      attributeValueId: { type: DataTypes.BIGINT, allowNull: false, field: 'attribute_value_id' },
    },
    {
      sequelize,
      tableName: 'product_variant_values',
      modelName: 'ProductVariantValue',
      underscored: true,
      timestamps: false,
    },
  );
}

import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize';

export class ProductOption extends Model<
  InferAttributes<ProductOption>,
  InferCreationAttributes<ProductOption>
> {
  declare productId: number;
  declare attributeId: number;
  declare position: number;
}

export function initProductOptionModel(sequelize: Sequelize) {
  ProductOption.init(
    {
      productId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        field: 'product_id',
      },
      attributeId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        field: 'attribute_id',
      },
      position: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    },
    {
      sequelize,
      tableName: 'product_options',
      modelName: 'ProductOption',
      underscored: true,
      timestamps: false,
    },
  );
}

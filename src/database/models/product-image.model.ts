import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export class ProductImage extends Model<
  InferAttributes<ProductImage>,
  InferCreationAttributes<ProductImage>
> {
  declare id: CreationOptional<number>;
  declare productId: number;
  declare url: string;
  declare isPrimary: boolean;
  declare position: number;
  declare createdAt: CreationOptional<Date>;
}

export function initProductImageModel(sequelize: Sequelize) {
  ProductImage.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      productId: { type: DataTypes.BIGINT, allowNull: false, field: 'product_id' },
      url: { type: DataTypes.TEXT, allowNull: false },
      isPrimary: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_primary',
      },
      position: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      createdAt: { type: DataTypes.DATE, field: 'created_at' },
    },
    {
      sequelize,
      tableName: 'product_images',
      modelName: 'ProductImage',
      underscored: true,
      timestamps: true,
      updatedAt: false,
    },
  );
}

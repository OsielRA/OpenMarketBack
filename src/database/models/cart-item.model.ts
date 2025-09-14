import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export class CartItem extends Model<InferAttributes<CartItem>, InferCreationAttributes<CartItem>> {
  declare id: CreationOptional<number>;
  declare cartId: number;
  declare productId: number;
  declare varInferAttributesntId: number | null;
  declare quantity: number;
  declare priceAtAdd: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initCartItemModel(sequelize: Sequelize) {
  CartItem.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      cartId: { type: DataTypes.BIGINT, allowNull: false, field: 'cart_id' },
      productId: { type: DataTypes.BIGINT, allowNull: false, field: 'product_id' },
      varInferAttributesntId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'varInferAttributesnt_id',
      },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      priceAtAdd: { type: DataTypes.DECIMAL(12, 2), allowNull: false, field: 'price_at_add' },
      createdAt: { type: DataTypes.DATE, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
    },
    {
      sequelize,
      tableName: 'cart_items',
      modelName: 'CartItem',
      underscored: true,
      timestamps: true,
    },
  );
}

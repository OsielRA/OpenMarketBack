import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export class OrderItem extends Model<
  InferAttributes<OrderItem>,
  InferCreationAttributes<OrderItem>
> {
  declare id: CreationOptional<number>;
  declare orderId: number;
  declare storeId: number;
  declare productId: number;
  declare variantId: number | null;
  declare titleSnapshot: string;
  declare skuSnapshot: string | null;
  declare price: number;
  declare quantity: number;
  declare fulfillmentStatus:
    | 'pending'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'returned';
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initOrderItemModel(sequelize: Sequelize) {
  OrderItem.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      orderId: { type: DataTypes.BIGINT, allowNull: false, field: 'order_id' },
      storeId: { type: DataTypes.BIGINT, allowNull: false, field: 'store_id' },
      productId: { type: DataTypes.BIGINT, allowNull: false, field: 'product_id' },
      variantId: { type: DataTypes.BIGINT, allowNull: true, field: 'variant_id' },
      titleSnapshot: { type: DataTypes.STRING(180), allowNull: false, field: 'title_snapshot' },
      skuSnapshot: { type: DataTypes.STRING(64), allowNull: true, field: 'sku_snapshot' },
      price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      fulfillmentStatus: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'pending',
        field: 'fulfillment_status',
      },
      createdAt: { type: DataTypes.DATE, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
    },
    {
      sequelize,
      tableName: 'order_items',
      modelName: 'OrderItem',
      underscored: true,
      timestamps: true,
    },
  );
}

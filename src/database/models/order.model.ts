import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare status: 'pending' | 'paid' | 'cancelled' | 'refunded' | 'completed';
  declare paymentStatus: 'pending' | 'authorized' | 'paid' | 'failed' | 'refunded';
  declare currency: string | null;
  declare subtotalAmount: number;
  declare shippingAmount: number;
  declare taxAmount: number;
  declare discountAmount: number;
  declare totalAmount: number;
  declare notes: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initOrderModel(sequelize: Sequelize) {
  Order.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      userId: { type: DataTypes.BIGINT, allowNull: false, field: 'user_id' },
      status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'pending' },
      paymentStatus: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'pending',
        field: 'payment_status',
      },
      currency: { type: DataTypes.STRING(3), allowNull: true },
      subtotalAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'subtotal_amount',
      },
      shippingAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'shipping_amount',
      },
      taxAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'tax_amount',
      },
      discountAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'discount_amount',
      },
      totalAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'total_amount',
      },
      notes: { type: DataTypes.TEXT, allowNull: true },
      createdAt: { type: DataTypes.DATE, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
    },
    { sequelize, tableName: 'orders', modelName: 'Order', underscored: true, timestamps: true },
  );
}

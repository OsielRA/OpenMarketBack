import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export class Payment extends Model<InferAttributes<Payment>, InferCreationAttributes<Payment>> {
  declare id: CreationOptional<number>;
  declare orderId: number;
  declare provider: string;
  declare status: 'pending' | 'authorized' | 'paid' | 'failed' | 'refunded';
  declare amount: number;
  declare currency: string | null;
  declare transactionId: string | null;
  declare rawPayload: Record<string, unknown> | null;
  declare processedAt: Date | null;
  declare createdAt: CreationOptional<Date>;
}

export function initPaymentModel(sequelize: Sequelize) {
  Payment.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      orderId: { type: DataTypes.BIGINT, allowNull: false, field: 'order_id' },
      provider: { type: DataTypes.STRING(40), allowNull: false },
      status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'pending' },
      amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      currency: { type: DataTypes.STRING(3), allowNull: true },
      transactionId: { type: DataTypes.STRING(120), allowNull: true, field: 'transaction_id' },
      rawPayload: { type: DataTypes.JSONB, allowNull: true, field: 'raw_payload' },
      processedAt: { type: DataTypes.DATE, allowNull: true, field: 'processed_at' },
      createdAt: { type: DataTypes.DATE, field: 'created_at' },
    },
    {
      sequelize,
      tableName: 'payments',
      modelName: 'Payment',
      underscored: true,
      timestamps: true,
      updatedAt: false,
    },
  );
}

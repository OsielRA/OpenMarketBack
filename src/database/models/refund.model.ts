import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export class Refund extends Model<InferAttributes<Refund>, InferCreationAttributes<Refund>> {
  declare id: CreationOptional<number>;
  declare paymentId: number;
  declare amount: number;
  declare reason: string | null;
  declare processedAt: Date | null;
  declare createdAt: CreationOptional<Date>;
}

export function initRefundModel(sequelize: Sequelize) {
  Refund.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      paymentId: { type: DataTypes.BIGINT, allowNull: false, field: 'payment_id' },
      amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      reason: { type: DataTypes.STRING(160), allowNull: true },
      processedAt: { type: DataTypes.DATE, allowNull: true, field: 'processed_at' },
      createdAt: { type: DataTypes.DATE, field: 'created_at' },
    },
    {
      sequelize,
      tableName: 'refunds',
      modelName: 'Refund',
      underscored: true,
      timestamps: true,
      updatedAt: false,
    },
  );
}

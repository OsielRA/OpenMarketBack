import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export class Shipment extends Model<InferAttributes<Shipment>, InferCreationAttributes<Shipment>> {
  declare id: CreationOptional<number>;
  declare orderId: number;
  declare storeId: number;
  declare carrier: string | null;
  declare service: string | null;
  declare trackingNo: string | null;
  declare status: 'pending' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  declare shippedAt: Date | null;
  declare deliveredAt: Date | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initShipmentModel(sequelize: Sequelize) {
  Shipment.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      orderId: { type: DataTypes.BIGINT, allowNull: false, field: 'order_id' },
      storeId: { type: DataTypes.BIGINT, allowNull: false, field: 'store_id' },
      carrier: { type: DataTypes.STRING(60), allowNull: true },
      service: { type: DataTypes.STRING(60), allowNull: true },
      trackingNo: { type: DataTypes.STRING(80), allowNull: true, field: 'tracking_no' },
      status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'pending' },
      shippedAt: { type: DataTypes.DATE, allowNull: true, field: 'shipped_at' },
      deliveredAt: { type: DataTypes.DATE, allowNull: true, field: 'delivered_at' },
      createdAt: { type: DataTypes.DATE, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
    },
    {
      sequelize,
      tableName: 'shipments',
      modelName: 'Shipment',
      underscored: true,
      timestamps: true,
    },
  );
}

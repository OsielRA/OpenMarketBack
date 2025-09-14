import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export class ShipmentItem extends Model<
  InferAttributes<ShipmentItem>,
  InferCreationAttributes<ShipmentItem>
> {
  declare id: CreationOptional<number>;
  declare shipmentId: number;
  declare orderItemId: number;
  declare quantity: number;
}

export function initShipmentItemModel(sequelize: Sequelize) {
  ShipmentItem.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      shipmentId: { type: DataTypes.BIGINT, allowNull: false, field: 'shipment_id' },
      orderItemId: { type: DataTypes.BIGINT, allowNull: false, field: 'order_item_id' },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      tableName: 'shipment_items',
      modelName: 'ShipmentItem',
      underscored: true,
      timestamps: false,
    },
  );
}

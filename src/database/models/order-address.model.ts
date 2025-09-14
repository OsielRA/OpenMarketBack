import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export class OrderAddress extends Model<
  InferAttributes<OrderAddress>,
  InferCreationAttributes<OrderAddress>
> {
  declare id: CreationOptional<number>;
  declare orderId: number;
  declare type: 'shipping' | 'billing';
  declare recipient: string;
  declare phone: string | null;
  declare line1: string;
  declare line2: string | null;
  declare city: string;
  declare state: string;
  declare postalCode: string;
  declare countryCode: string;
  declare createdAt: CreationOptional<Date>;
}

export function initOrderAddressModel(sequelize: Sequelize) {
  OrderAddress.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      orderId: { type: DataTypes.BIGINT, allowNull: false, field: 'order_id' },
      type: { type: DataTypes.STRING(20), allowNull: false },
      recipient: { type: DataTypes.STRING(150), allowNull: false },
      phone: { type: DataTypes.STRING(30), allowNull: true },
      line1: { type: DataTypes.STRING(160), allowNull: false },
      line2: { type: DataTypes.STRING(160), allowNull: true },
      city: { type: DataTypes.STRING(120), allowNull: false },
      state: { type: DataTypes.STRING(120), allowNull: false },
      postalCode: { type: DataTypes.STRING(20), allowNull: false, field: 'postal_code' },
      countryCode: { type: DataTypes.STRING(2), allowNull: false, field: 'country_code' },
      createdAt: { type: DataTypes.DATE, field: 'created_at' },
    },
    {
      sequelize,
      tableName: 'order_addresses',
      modelName: 'OrderAddress',
      underscored: true,
      timestamps: true,
      updatedAt: false,
    },
  );
}

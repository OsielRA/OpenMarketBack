import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export class Address extends Model<InferAttributes<Address>, InferCreationAttributes<Address>> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare label: string | null;
  declare recipient: string;
  declare phone: string | null;
  declare line1: string;
  declare line2: string | null;
  declare city: string;
  declare state: string;
  declare postalCode: string;
  declare countryCode: string;
  declare isDefault: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initAddressModel(sequelize: Sequelize) {
  Address.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      userId: { type: DataTypes.BIGINT, allowNull: false, field: 'user_id' },
      label: { type: DataTypes.STRING(80), allowNull: true },
      recipient: { type: DataTypes.STRING(150), allowNull: false },
      phone: { type: DataTypes.STRING(30), allowNull: true },
      line1: { type: DataTypes.STRING(160), allowNull: false },
      line2: { type: DataTypes.STRING(160), allowNull: true },
      city: { type: DataTypes.STRING(120), allowNull: false },
      state: { type: DataTypes.STRING(120), allowNull: false },
      postalCode: { type: DataTypes.STRING(20), allowNull: false, field: 'postal_code' },
      countryCode: { type: DataTypes.STRING(2), allowNull: false, field: 'country_code' },
      isDefault: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_default',
      },
      createdAt: { type: DataTypes.DATE, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
    },
    {
      sequelize,
      tableName: 'addresses',
      modelName: 'Address',
      underscored: true,
      timestamps: true,
    },
  );
}

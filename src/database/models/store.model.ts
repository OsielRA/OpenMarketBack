import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export class Store extends Model<InferAttributes<Store>, InferCreationAttributes<Store>> {
  declare id: CreationOptional<number>;
  declare ownerUserId: number;
  declare name: string;
  declare slug: string;
  declare description: string | null;
  declare logoUrl: string | null;
  declare ratingAvg: number;
  declare isActive: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initStoreModel(sequelize: Sequelize) {
  Store.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      ownerUserId: { type: DataTypes.BIGINT, allowNull: false, field: 'owner_user_id' },
      name: { type: DataTypes.STRING(120), allowNull: false },
      slug: { type: DataTypes.STRING(140), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      logoUrl: { type: DataTypes.TEXT, allowNull: true, field: 'logo_url' },
      ratingAvg: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'rating_avg',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
      },
      createdAt: { type: DataTypes.DATE, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
    },
    { sequelize, tableName: 'stores', modelName: 'Store', underscored: true, timestamps: true },
  );
}

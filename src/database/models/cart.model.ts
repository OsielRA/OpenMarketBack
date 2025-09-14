import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export class Cart extends Model<InferAttributes<Cart>, InferCreationAttributes<Cart>> {
  declare id: CreationOptional<number>;
  declare userId: number | null;
  declare sessionId: string | null;
  declare status: 'active' | 'converted' | 'abandoned';
  declare currency: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initCartModel(sequelize: Sequelize) {
  Cart.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      userId: { type: DataTypes.BIGINT, allowNull: true, field: 'user_id' },
      sessionId: { type: DataTypes.STRING(100), allowNull: true, field: 'session_id' },
      status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'active' },
      currency: { type: DataTypes.STRING(3), allowNull: true },
      createdAt: { type: DataTypes.DATE, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
    },
    { sequelize, tableName: 'carts', modelName: 'Cart', underscored: true, timestamps: true },
  );
}

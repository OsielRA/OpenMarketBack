import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export class InventoryMovement extends Model<
  InferAttributes<InventoryMovement>,
  InferCreationAttributes<InventoryMovement>
> {
  declare id: CreationOptional<number>;
  declare variantId: number;
  declare changeQty: number;
  declare reason: string;
  declare reference: string | null;
  declare createdAt: CreationOptional<Date>;
}

export function initInventoryMovementModel(sequelize: Sequelize) {
  InventoryMovement.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      variantId: { type: DataTypes.BIGINT, allowNull: false, field: 'variant_id' },
      changeQty: { type: DataTypes.INTEGER, allowNull: false, field: 'change_qty' },
      reason: { type: DataTypes.STRING(60), allowNull: false },
      reference: { type: DataTypes.STRING(120), allowNull: true },
      createdAt: { type: DataTypes.DATE, field: 'created_at' },
    },
    {
      sequelize,
      tableName: 'inventory_movements',
      modelName: 'InventoryMovement',
      underscored: true,
      timestamps: true,
      updatedAt: false,
    },
  );
}

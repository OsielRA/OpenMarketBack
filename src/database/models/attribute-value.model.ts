import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export class AttributeValue extends Model<
  InferAttributes<AttributeValue>,
  InferCreationAttributes<AttributeValue>
> {
  declare id: CreationOptional<number>;
  declare attributeId: number;
  declare value: string;
  declare extra: Record<string, unknown> | null;
  declare position: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initAttributeValueModel(sequelize: Sequelize) {
  AttributeValue.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      attributeId: { type: DataTypes.BIGINT, allowNull: false, field: 'attribute_id' },
      value: { type: DataTypes.STRING(120), allowNull: false },
      extra: { type: DataTypes.JSONB, allowNull: true },
      position: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      createdAt: { type: DataTypes.DATE, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
    },
    {
      sequelize,
      tableName: 'attribute_values',
      modelName: 'AttributeValue',
      underscored: true,
      timestamps: true,
    },
  );
}

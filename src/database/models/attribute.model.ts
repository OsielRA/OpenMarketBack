import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export class Attribute extends Model<
  InferAttributes<Attribute>,
  InferCreationAttributes<Attribute>
> {
  declare id: CreationOptional<number>;
  declare code: string;
  declare name: string;
  declare valueType: 'text' | 'number' | 'color' | 'select';
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initAttributeModel(sequelize: Sequelize) {
  Attribute.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      code: { type: DataTypes.STRING(60), allowNull: false },
      name: { type: DataTypes.STRING(120), allowNull: false },
      valueType: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'text',
        field: 'value_type',
      },
      createdAt: { type: DataTypes.DATE, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
    },
    {
      sequelize,
      tableName: 'attributes',
      modelName: 'Attribute',
      underscored: true,
      timestamps: true,
    },
  );
}

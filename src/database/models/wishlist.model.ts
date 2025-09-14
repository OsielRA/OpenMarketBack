import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export class Wishlist extends Model<InferAttributes<Wishlist>, InferCreationAttributes<Wishlist>> {
  declare userId: number;
  declare productId: number;
  declare createdAt: CreationOptional<Date>;
}

export function initWishlistModel(sequelize: Sequelize) {
  Wishlist.init(
    {
      userId: { type: DataTypes.BIGINT, allowNull: false, primaryKey: true, field: 'user_id' },
      productId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        field: 'product_id',
      },
      createdAt: { type: DataTypes.DATE, field: 'created_at' },
    },
    {
      sequelize,
      tableName: 'wishlists',
      modelName: 'Wishlist',
      underscored: true,
      timestamps: true,
      updatedAt: false,
    },
  );
}

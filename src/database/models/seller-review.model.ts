import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export class SellerReview extends Model<
  InferAttributes<SellerReview>,
  InferCreationAttributes<SellerReview>
> {
  declare id: CreationOptional<number>;
  declare storeId: number;
  declare authorUserId: number;
  declare rating: number;
  declare title: string | null;
  declare body: string | null;
  declare status: 'pending' | 'approved' | 'rejected';
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initSellerReviewModel(sequelize: Sequelize) {
  SellerReview.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      storeId: { type: DataTypes.BIGINT, allowNull: false, field: 'store_id' },
      authorUserId: { type: DataTypes.BIGINT, allowNull: false, field: 'author_user_id' },
      rating: { type: DataTypes.SMALLINT, allowNull: false },
      title: { type: DataTypes.STRING(160), allowNull: true },
      body: { type: DataTypes.TEXT, allowNull: true },
      status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'pending' },
      createdAt: { type: DataTypes.DATE, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
    },
    {
      sequelize,
      tableName: 'seller_reviews',
      modelName: 'SellerReview',
      underscored: true,
      timestamps: true,
    },
  );
}

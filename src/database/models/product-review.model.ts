import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export class ProductReview extends Model<
  InferAttributes<ProductReview>,
  InferCreationAttributes<ProductReview>
> {
  declare id: CreationOptional<number>;
  declare productId: number;
  declare authorUserId: number;
  declare rating: number;
  declare title: string | null;
  declare body: string | null;
  declare status: 'pending' | 'approved' | 'rejected';
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initProductReviewModel(sequelize: Sequelize) {
  ProductReview.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      productId: { type: DataTypes.BIGINT, allowNull: false, field: 'product_id' },
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
      tableName: 'product_reviews',
      modelName: 'ProductReview',
      underscored: true,
      timestamps: true,
    },
  );
}

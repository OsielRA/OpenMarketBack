'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        'product_reviews',
        {
          id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
          product_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: { model: 'products', key: 'id' },
            onDelete: 'CASCADE',
          },
          author_user_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: { model: 'users', key: 'id' },
            onDelete: 'RESTRICT',
          },
          rating: { type: Sequelize.SMALLINT, allowNull: false },
          title: { type: Sequelize.STRING(160) },
          body: { type: Sequelize.TEXT },
          status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'pending' },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
          updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
        },
        { transaction: t },
      );

      await queryInterface.addIndex('product_reviews', ['product_id'], {
        name: 'product_reviews_prod_idx',
        transaction: t,
      });
      await queryInterface.addConstraint('product_reviews', {
        type: 'unique',
        fields: ['product_id', 'author_user_id'],
        name: 'product_reviews_unique_user_per_product',
        transaction: t,
      });
      await queryInterface.sequelize.query(
        `ALTER TABLE product_reviews ADD CONSTRAINT product_reviews_rating_chk CHECK (rating BETWEEN 1 AND 5);`,
        { transaction: t },
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE product_reviews ADD CONSTRAINT product_reviews_status_chk CHECK (status IN ('pending','approved','rejected'));`,
        { transaction: t },
      );

      await queryInterface.createTable(
        'seller_reviews',
        {
          id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
          store_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: { model: 'stores', key: 'id' },
            onDelete: 'CASCADE',
          },
          author_user_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: { model: 'users', key: 'id' },
            onDelete: 'RESTRICT',
          },
          rating: { type: Sequelize.SMALLINT, allowNull: false },
          title: { type: Sequelize.STRING(160) },
          body: { type: Sequelize.TEXT },
          status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'pending' },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
          updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
        },
        { transaction: t },
      );

      await queryInterface.addIndex('seller_reviews', ['store_id'], {
        name: 'seller_reviews_store_idx',
        transaction: t,
      });
      await queryInterface.addConstraint('seller_reviews', {
        type: 'unique',
        fields: ['store_id', 'author_user_id'],
        name: 'seller_reviews_unique_user_per_store',
        transaction: t,
      });
      await queryInterface.sequelize.query(
        `ALTER TABLE seller_reviews ADD CONSTRAINT seller_reviews_rating_chk CHECK (rating BETWEEN 1 AND 5);`,
        { transaction: t },
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE seller_reviews ADD CONSTRAINT seller_reviews_status_chk CHECK (status IN ('pending','approved','rejected'));`,
        { transaction: t },
      );

      await queryInterface.createTable(
        'wishlists',
        {
          user_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: { model: 'users', key: 'id' },
            onDelete: 'CASCADE',
          },
          product_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: { model: 'products', key: 'id' },
            onDelete: 'CASCADE',
          },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
        },
        { transaction: t },
      );
      await queryInterface.addConstraint('wishlists', {
        type: 'primary key',
        fields: ['user_id', 'product_id'],
        name: 'wishlists_pkey',
        transaction: t,
      });
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable('wishlists', { transaction: t });
      await queryInterface.dropTable('seller_reviews', { transaction: t });
      await queryInterface.dropTable('product_reviews', { transaction: t });
    });
  },
};

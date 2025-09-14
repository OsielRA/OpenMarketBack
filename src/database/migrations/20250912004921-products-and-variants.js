'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      // PRODUCTS
      await queryInterface.createTable(
        'products',
        {
          id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
          store_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: { model: 'stores', key: 'id' },
            onDelete: 'RESTRICT',
          },
          category_id: {
            type: Sequelize.BIGINT,
            references: { model: 'categories', key: 'id' },
            onDelete: 'SET NULL',
          },
          brand_id: {
            type: Sequelize.BIGINT,
            references: { model: 'brands', key: 'id' },
            onDelete: 'SET NULL',
          },
          title: { type: Sequelize.STRING(180), allowNull: false },
          slug: { type: Sequelize.STRING(200), allowNull: false },
          description: { type: Sequelize.TEXT },
          condition: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'new' },
          status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'draft' },
          has_variants: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
          price: { type: Sequelize.DECIMAL(12, 2) },
          stock_qty: { type: Sequelize.INTEGER },
          currency: { type: Sequelize.STRING(3), defaultValue: 'MXN' },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
          updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
        },
        { transaction: t },
      );

      await queryInterface.addIndex('products', ['store_id'], {
        name: 'products_store_idx',
        transaction: t,
      });
      await queryInterface.addIndex('products', ['category_id'], {
        name: 'products_category_idx',
        transaction: t,
      });
      await queryInterface.addIndex('products', ['store_id', 'slug'], {
        unique: true,
        name: 'products_store_slug_uindex',
        transaction: t,
      });

      await queryInterface.sequelize.query(
        `ALTER TABLE products ADD CONSTRAINT products_condition_chk CHECK (condition IN ('new','used','refurbished'));`,
        { transaction: t },
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE products ADD CONSTRAINT products_status_chk CHECK (status IN ('draft','published','archived'));`,
        { transaction: t },
      );

      // PRODUCT IMAGES
      await queryInterface.createTable(
        'product_images',
        {
          id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
          product_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: { model: 'products', key: 'id' },
            onDelete: 'CASCADE',
          },
          url: { type: Sequelize.TEXT, allowNull: false },
          is_primary: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
          position: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
        },
        { transaction: t },
      );
      await queryInterface.addIndex('product_images', ['product_id'], {
        name: 'product_images_prod_idx',
        transaction: t,
      });

      // PRODUCT OPTIONS (which attributes are used for variants)
      await queryInterface.createTable(
        'product_options',
        {
          product_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: { model: 'products', key: 'id' },
            onDelete: 'CASCADE',
          },
          attribute_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: { model: 'attributes', key: 'id' },
            onDelete: 'RESTRICT',
          },
          position: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
        },
        { transaction: t },
      );
      await queryInterface.addConstraint('product_options', {
        type: 'primary key',
        fields: ['product_id', 'attribute_id'],
        name: 'product_options_pkey',
        transaction: t,
      });

      // PRODUCT VARIANTS
      await queryInterface.createTable(
        'product_variants',
        {
          id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
          product_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: { model: 'products', key: 'id' },
            onDelete: 'CASCADE',
          },
          sku: { type: Sequelize.STRING(64), allowNull: false },
          price: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
          compare_at_price: { type: Sequelize.DECIMAL(12, 2) },
          stock_qty: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
          barcode: { type: Sequelize.STRING(64) },
          weight_grams: { type: Sequelize.INTEGER },
          length_cm: { type: Sequelize.DECIMAL(10, 2) },
          width_cm: { type: Sequelize.DECIMAL(10, 2) },
          height_cm: { type: Sequelize.DECIMAL(10, 2) },
          is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
          updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
        },
        { transaction: t },
      );

      await queryInterface.addIndex('product_variants', ['product_id'], {
        name: 'product_variants_product_idx',
        transaction: t,
      });
      await queryInterface.addIndex('product_variants', ['product_id', 'sku'], {
        unique: true,
        name: 'product_variants_sku_per_product_uindex',
        transaction: t,
      });

      // VARIANT VALUES
      await queryInterface.createTable(
        'product_variant_values',
        {
          variant_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: { model: 'product_variants', key: 'id' },
            onDelete: 'CASCADE',
          },
          attribute_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: { model: 'attributes', key: 'id' },
            onDelete: 'RESTRICT',
          },
          attribute_value_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: { model: 'attribute_values', key: 'id' },
            onDelete: 'RESTRICT',
          },
        },
        { transaction: t },
      );
      await queryInterface.addConstraint('product_variant_values', {
        type: 'primary key',
        fields: ['variant_id', 'attribute_id'],
        name: 'product_variant_values_pkey',
        transaction: t,
      });
      await queryInterface.addIndex('product_variant_values', ['variant_id'], {
        name: 'pvv_variant_idx',
        transaction: t,
      });
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable('product_variant_values', { transaction: t });
      await queryInterface.dropTable('product_variants', { transaction: t });
      await queryInterface.dropTable('product_options', { transaction: t });
      await queryInterface.dropTable('product_images', { transaction: t });
      await queryInterface.dropTable('products', { transaction: t });
    });
  },
};

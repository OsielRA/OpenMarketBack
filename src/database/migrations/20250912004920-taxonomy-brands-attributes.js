'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      // CATEGORIES
      await queryInterface.createTable(
        'categories',
        {
          id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
          parent_id: {
            type: Sequelize.BIGINT,
            references: { model: 'categories', key: 'id' },
            onDelete: 'SET NULL',
          },
          name: { type: Sequelize.STRING(120), allowNull: false },
          slug: { type: Sequelize.STRING(140), allowNull: false },
          position: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
          updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
        },
        { transaction: t },
      );
      await queryInterface.addIndex('categories', ['parent_id'], {
        name: 'categories_parent_idx',
        transaction: t,
      });
      await queryInterface.addIndex('categories', ['slug'], {
        unique: true,
        name: 'categories_slug_uindex',
        transaction: t,
      });

      // BRANDS
      await queryInterface.createTable(
        'brands',
        {
          id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
          name: { type: Sequelize.STRING(120), allowNull: false },
          slug: { type: Sequelize.STRING(140), allowNull: false },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
          updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
        },
        { transaction: t },
      );
      await queryInterface.addIndex('brands', ['slug'], {
        unique: true,
        name: 'brands_slug_uindex',
        transaction: t,
      });
      await queryInterface.addIndex('brands', ['name'], {
        unique: true,
        name: 'brands_name_uindex',
        transaction: t,
      });

      // ATTRIBUTES
      await queryInterface.createTable(
        'attributes',
        {
          id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
          code: { type: Sequelize.STRING(60), allowNull: false },
          name: { type: Sequelize.STRING(120), allowNull: false },
          value_type: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'text' }, // text|number|color|select
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
          updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
        },
        { transaction: t },
      );

      await queryInterface.addIndex('attributes', ['code'], {
        unique: true,
        name: 'attributes_code_uindex',
        transaction: t,
      });
      await queryInterface.sequelize.query(
        `ALTER TABLE attributes ADD CONSTRAINT attributes_value_type_chk CHECK (value_type IN ('text','number','color','select'));`,
        { transaction: t },
      );

      // ATTRIBUTE VALUES
      await queryInterface.createTable(
        'attribute_values',
        {
          id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
          attribute_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: { model: 'attributes', key: 'id' },
            onDelete: 'CASCADE',
          },
          value: { type: Sequelize.STRING(120), allowNull: false },
          extra: { type: Sequelize.JSONB },
          position: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
          updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
        },
        { transaction: t },
      );

      await queryInterface.addConstraint('attribute_values', {
        type: 'unique',
        fields: ['attribute_id', 'value'],
        name: 'attribute_values_unique_value_per_attribute',
        transaction: t,
      });
      await queryInterface.addIndex('attribute_values', ['attribute_id'], {
        name: 'attribute_values_attr_idx',
        transaction: t,
      });
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable('attribute_values', { transaction: t });
      await queryInterface.dropTable('attributes', { transaction: t });
      await queryInterface.dropTable('brands', { transaction: t });
      await queryInterface.dropTable('categories', { transaction: t });
    });
  },
};

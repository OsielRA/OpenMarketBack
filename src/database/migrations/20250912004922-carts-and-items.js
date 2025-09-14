'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        'carts',
        {
          id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
          user_id: {
            type: Sequelize.BIGINT,
            references: { model: 'users', key: 'id' },
            onDelete: 'SET NULL',
          },
          session_id: { type: Sequelize.STRING(100) },
          status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'active' }, // active|converted|abandoned
          currency: { type: Sequelize.STRING(3), defaultValue: 'MXN' },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
          updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
        },
        { transaction: t },
      );

      await queryInterface.addIndex('carts', ['user_id'], {
        name: 'carts_user_idx',
        transaction: t,
      });
      await queryInterface.addIndex('carts', ['session_id'], {
        name: 'carts_session_idx',
        transaction: t,
      });
      await queryInterface.sequelize.query(
        `ALTER TABLE carts ADD CONSTRAINT carts_status_chk CHECK (status IN ('active','converted','abandoned'));`,
        { transaction: t },
      );

      await queryInterface.createTable(
        'cart_items',
        {
          id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
          cart_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: { model: 'carts', key: 'id' },
            onDelete: 'CASCADE',
          },
          product_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: { model: 'products', key: 'id' },
            onDelete: 'RESTRICT',
          },
          variant_id: {
            type: Sequelize.BIGINT,
            references: { model: 'product_variants', key: 'id' },
            onDelete: 'RESTRICT',
          },
          quantity: { type: Sequelize.INTEGER, allowNull: false },
          price_at_add: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
          updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
        },
        { transaction: t },
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE cart_items ADD CONSTRAINT cart_items_quantity_chk CHECK (quantity > 0);`,
        { transaction: t },
      );
      await queryInterface.addIndex('cart_items', ['cart_id'], {
        name: 'cart_items_cart_idx',
        transaction: t,
      });
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable('cart_items', { transaction: t });
      await queryInterface.dropTable('carts', { transaction: t });
    });
  },
};

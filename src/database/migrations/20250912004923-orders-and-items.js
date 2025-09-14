'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        'orders',
        {
          id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
          user_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: { model: 'users', key: 'id' },
            onDelete: 'RESTRICT',
          },
          status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'pending' },
          payment_status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'pending' },
          currency: { type: Sequelize.STRING(3), defaultValue: 'MXN' },
          subtotal_amount: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
          shipping_amount: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
          tax_amount: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
          discount_amount: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
          total_amount: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
          notes: { type: Sequelize.TEXT },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
          updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
        },
        { transaction: t },
      );

      await queryInterface.addIndex('orders', ['user_id'], {
        name: 'orders_user_idx',
        transaction: t,
      });
      await queryInterface.sequelize.query(
        `ALTER TABLE orders ADD CONSTRAINT orders_status_chk CHECK (status IN ('pending','paid','cancelled','refunded','completed'));`,
        { transaction: t },
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE orders ADD CONSTRAINT orders_pay_status_chk CHECK (payment_status IN ('pending','authorized','paid','failed','refunded'));`,
        { transaction: t },
      );

      await queryInterface.createTable(
        'order_items',
        {
          id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
          order_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: { model: 'orders', key: 'id' },
            onDelete: 'CASCADE',
          },
          store_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: { model: 'stores', key: 'id' },
            onDelete: 'RESTRICT',
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
          title_snapshot: { type: Sequelize.STRING(180), allowNull: false },
          sku_snapshot: { type: Sequelize.STRING(64) },
          price: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
          quantity: { type: Sequelize.INTEGER, allowNull: false },
          fulfillment_status: {
            type: Sequelize.STRING(20),
            allowNull: false,
            defaultValue: 'pending',
          },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
          updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
        },
        { transaction: t },
      );

      await queryInterface.addIndex('order_items', ['order_id'], {
        name: 'order_items_order_idx',
        transaction: t,
      });
      await queryInterface.addIndex('order_items', ['store_id'], {
        name: 'order_items_store_idx',
        transaction: t,
      });
      await queryInterface.sequelize.query(
        `ALTER TABLE order_items ADD CONSTRAINT order_items_quantity_chk CHECK (quantity > 0);`,
        { transaction: t },
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE order_items ADD CONSTRAINT order_items_fulfill_chk CHECK (fulfillment_status IN ('pending','processing','shipped','delivered','cancelled','returned'));`,
        { transaction: t },
      );

      await queryInterface.createTable(
        'order_addresses',
        {
          id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
          order_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: { model: 'orders', key: 'id' },
            onDelete: 'CASCADE',
          },
          type: { type: Sequelize.STRING(20), allowNull: false }, // shipping|billing
          recipient: { type: Sequelize.STRING(150), allowNull: false },
          phone: { type: Sequelize.STRING(30) },
          line1: { type: Sequelize.STRING(160), allowNull: false },
          line2: { type: Sequelize.STRING(160) },
          city: { type: Sequelize.STRING(120), allowNull: false },
          state: { type: Sequelize.STRING(120), allowNull: false },
          postal_code: { type: Sequelize.STRING(20), allowNull: false },
          country_code: { type: Sequelize.STRING(2), allowNull: false },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
        },
        { transaction: t },
      );

      await queryInterface.addIndex('order_addresses', ['order_id'], {
        name: 'order_addresses_order_idx',
        transaction: t,
      });
      await queryInterface.sequelize.query(
        `ALTER TABLE order_addresses ADD CONSTRAINT order_addresses_type_chk CHECK (type IN ('shipping','billing'));`,
        { transaction: t },
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable('order_addresses', { transaction: t });
      await queryInterface.dropTable('order_items', { transaction: t });
      await queryInterface.dropTable('orders', { transaction: t });
    });
  },
};

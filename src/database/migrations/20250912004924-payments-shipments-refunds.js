'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        'payments',
        {
          id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
          order_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: { model: 'orders', key: 'id' },
            onDelete: 'RESTRICT',
          },
          provider: { type: Sequelize.STRING(40), allowNull: false },
          status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'pending' },
          amount: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
          currency: { type: Sequelize.STRING(3), defaultValue: 'MXN' },
          transaction_id: { type: Sequelize.STRING(120) },
          raw_payload: { type: Sequelize.JSONB },
          processed_at: { type: Sequelize.DATE },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
        },
        { transaction: t },
      );
      await queryInterface.addIndex('payments', ['order_id'], {
        name: 'payments_order_idx',
        transaction: t,
      });
      await queryInterface.sequelize.query(
        `ALTER TABLE payments ADD CONSTRAINT payments_status_chk CHECK (status IN ('pending','authorized','paid','failed','refunded'));`,
        { transaction: t },
      );

      await queryInterface.createTable(
        'shipments',
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
          carrier: { type: Sequelize.STRING(60) },
          service: { type: Sequelize.STRING(60) },
          tracking_no: { type: Sequelize.STRING(80) },
          status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'pending' },
          shipped_at: { type: Sequelize.DATE },
          delivered_at: { type: Sequelize.DATE },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
          updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
        },
        { transaction: t },
      );

      await queryInterface.addIndex('shipments', ['order_id'], {
        name: 'shipments_order_idx',
        transaction: t,
      });
      await queryInterface.sequelize.query(
        `ALTER TABLE shipments ADD CONSTRAINT shipments_status_chk CHECK (status IN ('pending','shipped','delivered','cancelled','returned'));`,
        { transaction: t },
      );

      await queryInterface.createTable(
        'shipment_items',
        {
          id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
          shipment_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: { model: 'shipments', key: 'id' },
            onDelete: 'CASCADE',
          },
          order_item_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: { model: 'order_items', key: 'id' },
            onDelete: 'RESTRICT',
          },
          quantity: { type: Sequelize.INTEGER, allowNull: false },
        },
        { transaction: t },
      );
      await queryInterface.addIndex('shipment_items', ['shipment_id'], {
        name: 'shipment_items_ship_idx',
        transaction: t,
      });
      await queryInterface.sequelize.query(
        `ALTER TABLE shipment_items ADD CONSTRAINT shipment_items_quantity_chk CHECK (quantity > 0);`,
        { transaction: t },
      );

      await queryInterface.createTable(
        'refunds',
        {
          id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
          payment_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: { model: 'payments', key: 'id' },
            onDelete: 'RESTRICT',
          },
          amount: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
          reason: { type: Sequelize.STRING(160) },
          processed_at: { type: Sequelize.DATE },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
        },
        { transaction: t },
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable('refunds', { transaction: t });
      await queryInterface.dropTable('shipment_items', { transaction: t });
      await queryInterface.dropTable('shipments', { transaction: t });
      await queryInterface.dropTable('payments', { transaction: t });
    });
  },
};

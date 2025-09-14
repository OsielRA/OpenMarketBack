'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        'inventory_movements',
        {
          id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
          variant_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: { model: 'product_variants', key: 'id' },
            onDelete: 'CASCADE',
          },
          change_qty: { type: Sequelize.INTEGER, allowNull: false },
          reason: { type: Sequelize.STRING(60), allowNull: false }, // order|refund|manual|adjustment
          reference: { type: Sequelize.STRING(120) },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
        },
        { transaction: t },
      );
      await queryInterface.addIndex('inventory_movements', ['variant_id'], {
        name: 'inventory_movements_variant_idx',
        transaction: t,
      });
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable('inventory_movements', { transaction: t });
    });
  },
};

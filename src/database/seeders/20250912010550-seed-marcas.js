'use strict';

module.exports = {
  async up(queryInterface) {
    const t = await queryInterface.sequelize.transaction();
    try {
      const now = new Date();
      await queryInterface.bulkInsert(
        'brands',
        [
          { name: 'OpenWear', slug: 'openwear', created_at: now, updated_at: now },
          { name: 'Urbana', slug: 'urbana', created_at: now, updated_at: now },
          { name: 'Genérica', slug: 'generica', created_at: now, updated_at: now },
        ],
        { transaction: t },
      );
      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('brands', { slug: ['openwear', 'urbana', 'generica'] });
  },
};

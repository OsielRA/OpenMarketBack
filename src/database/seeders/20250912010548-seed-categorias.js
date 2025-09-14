'use strict';

module.exports = {
  async up(queryInterface) {
    const t = await queryInterface.sequelize.transaction();
    try {
      const now = new Date();
      await queryInterface.bulkInsert(
        'categories',
        [
          { name: 'Mujer', slug: 'mujer', position: 1, created_at: now, updated_at: now },
          { name: 'Hombre', slug: 'hombre', position: 2, created_at: now, updated_at: now },
          { name: 'Accesorios', slug: 'accesorios', position: 3, created_at: now, updated_at: now },
          { name: 'Calzado', slug: 'calzado', position: 4, created_at: now, updated_at: now },
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
    await queryInterface.bulkDelete('categories', {
      slug: ['mujer', 'hombre', 'accesorios', 'calzado'],
    });
  },
};

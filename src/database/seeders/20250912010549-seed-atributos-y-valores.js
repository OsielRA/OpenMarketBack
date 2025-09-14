'use strict';

module.exports = {
  async up(queryInterface) {
    const t = await queryInterface.sequelize.transaction();
    try {
      const now = new Date();

      // Atributos (codigo estable en inglés; nombre para UI en español)
      await queryInterface.bulkInsert(
        'attributes',
        [
          { code: 'color', name: 'Color', value_type: 'color', created_at: now, updated_at: now },
          { code: 'size', name: 'Talla', value_type: 'select', created_at: now, updated_at: now },
        ],
        { transaction: t },
      );

      // Obtener IDs de atributos
      const [attrs] = await queryInterface.sequelize.query(
        `SELECT id, code FROM attributes WHERE code IN ('color','size')`,
        { transaction: t },
      );
      const attrMap = {};
      for (const row of attrs) attrMap[row.code] = row.id;

      // Valores de atributo en español
      await queryInterface.bulkInsert(
        'attribute_values',
        [
          // Colores
          {
            attribute_id: attrMap['color'],
            value: 'Negro',
            extra: JSON.stringify({ hex: '#000000' }),
            position: 1,
            created_at: now,
            updated_at: now,
          },
          {
            attribute_id: attrMap['color'],
            value: 'Blanco',
            extra: JSON.stringify({ hex: '#FFFFFF' }),
            position: 2,
            created_at: now,
            updated_at: now,
          },
          {
            attribute_id: attrMap['color'],
            value: 'Rojo',
            extra: JSON.stringify({ hex: '#FF0000' }),
            position: 3,
            created_at: now,
            updated_at: now,
          },
          // Tallas (estándar internacional)
          {
            attribute_id: attrMap['size'],
            value: 'XS',
            position: 1,
            created_at: now,
            updated_at: now,
          },
          {
            attribute_id: attrMap['size'],
            value: 'S',
            position: 2,
            created_at: now,
            updated_at: now,
          },
          {
            attribute_id: attrMap['size'],
            value: 'M',
            position: 3,
            created_at: now,
            updated_at: now,
          },
          {
            attribute_id: attrMap['size'],
            value: 'L',
            position: 4,
            created_at: now,
            updated_at: now,
          },
          {
            attribute_id: attrMap['size'],
            value: 'XL',
            position: 5,
            created_at: now,
            updated_at: now,
          },
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
    const t = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete('attribute_values', null, { transaction: t });
      await queryInterface.bulkDelete(
        'attributes',
        { code: ['color', 'size'] },
        { transaction: t },
      );
      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },
};

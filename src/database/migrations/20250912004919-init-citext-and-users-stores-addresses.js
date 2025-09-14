'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Enable CITEXT extension (outside transaction to be safe)
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS citext;');

    await queryInterface.sequelize.transaction(async (t) => {
      // USERS
      await queryInterface.createTable(
        'users',
        {
          id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
          email: { type: Sequelize.STRING, allowNull: false },
          password_hash: { type: Sequelize.TEXT, allowNull: false },
          full_name: { type: Sequelize.STRING(150), allowNull: false },
          phone: { type: Sequelize.STRING(30) },
          role: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'customer' },
          status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'active' },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
          updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
        },
        { transaction: t },
      );

      await queryInterface.sequelize.query(`ALTER TABLE users ALTER COLUMN email TYPE CITEXT;`, {
        transaction: t,
      });
      await queryInterface
        .addConstraint(
          'users',
          {
            type: 'check',
            fields: ['role'],
            name: 'users_role_chk',
            where: { role: ['customer', 'creator', 'admin'] },
          },
          { transaction: t },
        )
        .catch(() => {});

      await queryInterface.sequelize.query(
        `ALTER TABLE users ADD CONSTRAINT users_role_chk CHECK (role IN ('customer','creator','admin'));`,
        { transaction: t },
      );
      await queryInterface.sequelize.query(
        `ALTER TABLE users ADD CONSTRAINT users_status_chk CHECK (status IN ('active','suspended','pending'));`,
        { transaction: t },
      );
      await queryInterface.addIndex('users', ['email'], {
        unique: true,
        name: 'users_email_uindex',
        transaction: t,
      });

      // STORES
      await queryInterface.createTable(
        'stores',
        {
          id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
          owner_user_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: { model: 'users', key: 'id' },
            onDelete: 'RESTRICT',
          },
          name: { type: Sequelize.STRING(120), allowNull: false },
          slug: { type: Sequelize.STRING(140), allowNull: false },
          description: { type: Sequelize.TEXT },
          logo_url: { type: Sequelize.TEXT },
          rating_avg: { type: Sequelize.DECIMAL(3, 2), allowNull: false, defaultValue: 0.0 },
          is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
          updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
        },
        { transaction: t },
      );

      await queryInterface.addIndex('stores', ['slug'], {
        unique: true,
        name: 'stores_slug_uindex',
        transaction: t,
      });
      await queryInterface.addIndex('stores', ['owner_user_id'], {
        unique: true,
        name: 'stores_owner_unique',
        transaction: t,
      });

      // ADDRESSES
      await queryInterface.createTable(
        'addresses',
        {
          id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
          user_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: { model: 'users', key: 'id' },
            onDelete: 'CASCADE',
          },
          label: { type: Sequelize.STRING(80) },
          recipient: { type: Sequelize.STRING(150), allowNull: false },
          phone: { type: Sequelize.STRING(30) },
          line1: { type: Sequelize.STRING(160), allowNull: false },
          line2: { type: Sequelize.STRING(160) },
          city: { type: Sequelize.STRING(120), allowNull: false },
          state: { type: Sequelize.STRING(120), allowNull: false },
          postal_code: { type: Sequelize.STRING(20), allowNull: false },
          country_code: { type: Sequelize.STRING(2), allowNull: false },
          is_default: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
          updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
        },
        { transaction: t },
      );

      await queryInterface.addIndex('addresses', ['user_id'], {
        name: 'addresses_user_idx',
        transaction: t,
      });
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable('addresses', { transaction: t });
      await queryInterface.dropTable('stores', { transaction: t });
      await queryInterface.dropTable('users', { transaction: t });
    });
  },
};

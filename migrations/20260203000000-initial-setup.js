'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Users Table
        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            name: { type: Sequelize.STRING, allowNull: false },
            email: { type: Sequelize.STRING, allowNull: false, unique: true },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false },
        });

        // Wallets Table
        await queryInterface.createTable('wallets', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            userId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: 'users', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            balance: {
                type: Sequelize.DECIMAL(20, 8),
                allowNull: false,
                defaultValue: 0,
            },
            currency: { type: Sequelize.STRING, defaultValue: 'NGN' },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false },
        });

        // Transaction Logs Table
        await queryInterface.createTable('transaction_logs', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            idempotencyKey: { type: Sequelize.STRING, allowNull: false, unique: true },
            fromWalletId: { type: Sequelize.UUID, allowNull: true },
            toWalletId: { type: Sequelize.UUID, allowNull: true },
            amount: { type: Sequelize.DECIMAL(20, 8), allowNull: false },
            status: {
                type: Sequelize.ENUM('PENDING', 'SUCCESS', 'FAILED'),
                defaultValue: 'PENDING',
            },
            metadata: { type: Sequelize.STRING, allowNull: true },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('transaction_logs');
        await queryInterface.dropTable('wallets');
        await queryInterface.dropTable('users');
    },
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Ingredients', 'itemId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Items',
        key: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Ingredients', 'itemId')
  }
};

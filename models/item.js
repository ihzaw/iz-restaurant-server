'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Item.belongsTo(models.User, {foreignKey: 'authorId'}),
      Item.belongsTo(models.Category, {foreignKey: 'categoryId'}),
      Item.hasMany(models.Ingredient, {foreignKey: 'itemId'})
    }
  };
  Item.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: 'Item name is required'},
        notNull: {msg: 'Item name is required'},
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: 'Item description is required'},
        notNull: {msg: 'Item description is required'},
      },
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {msg: 'Item price is required'},
        notNull: {msg: 'Item price is required'},
        min: {
          args: [[5000]],
          msg: "Minimum Price is 5000"
        }
      },
    },
    imgUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: 'Image is required'},
        notNull: {msg: 'Image is required'},
      },
    }
  }, {
    sequelize,
    modelName: 'Item',
  });
  return Item;
};
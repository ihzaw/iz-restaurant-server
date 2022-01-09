'use strict';
const bcrypt = require('bcrypt')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Item, {foreignKey: 'authorId'})
    }
  };
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {msg: 'Username must be unique'},
      validate: {
        notEmpty: {msg: 'Username is required'},
        notNull: {msg: 'Username is required'}
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
      unique: {msg: 'Email must be unique'},
      validate: {
        notEmpty: {msg: 'Email is required'},
        notNull: {msg: 'Email is required'},
        isEmail: {msg: 'Email must be in correct format'}
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
      validate: {
        notEmpty: {msg: 'Password is required'},
        notNull: {msg: 'Password is required'},
        len: {
          args: [4,32],
          msg: "Minimum Password length is 5 characters"
        }
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: 'Role is required'},
        notNull: {msg: 'Role is required'},
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: 'Phone number is required'},
        notNull: {msg: 'Phone number is required'},
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: 'Address is required'},
        notNull: {msg: 'Address is required'},
      },
    }
  }, {
    hooks: {
      beforeCreate(instance) {
        const salt = bcrypt.genSaltSync(8)
        instance.password = bcrypt.hashSync(instance.password, salt)
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};
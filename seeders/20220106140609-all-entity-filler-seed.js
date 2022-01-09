"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          "username": "sample",
          "email": "sample@mail.com",
          "password": "sample",
          "role": "admin",
          "phoneNumber": "123412341234",
          "address": "sample address",
          "createdAt": new Date (),
          "updatedAt": new Date ()
        },
      ],
      {}
    );
    await queryInterface.bulkInsert(
      "Categories",
      [
        {
          "name": "Main dish",
          "createdAt": new Date (),
          "updatedAt": new Date ()
        }
      ],
      {}
    );
    await queryInterface.bulkInsert(
      "Items",
      [
        {
          "name": "yam goreng",
          "description": "ayam goreng yang menggunakan tepung dengan bumbu rahasia",
          "price": 22000,
          "imgUrl": "https://images-gmi-pmc.edge-generalmills.com/6fbc6859-e2b1-499d-b0fa-ada600c9cc3f.jpg",
          "authorId": 1,
          "categoryId": 1,
          "createdAt": new Date (),
          "updatedAt": new Date ()
        },
      ],
      {}
    );
    await queryInterface.bulkInsert(
      "Ingredients",
      [
        {
          "itemId": 1,
          "name": "Bawang putih",
          "createdAt": new Date (),
          "updatedAt": new Date ()
        },
        {
          "itemId": 1,
          "name": "Bawang merah",
          "createdAt": new Date (),
          "updatedAt": new Date ()
        },
        {
          "itemId": 1,
          "name": "Ketumbar",
          "createdAt": new Date (),
          "updatedAt": new Date ()
        }
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Categories', null, {});
    await queryInterface.bulkDelete('Items', null, {});
    await queryInterface.bulkDelete('Ingredients', null, {});
  },
};

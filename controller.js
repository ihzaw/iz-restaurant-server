const { sequelize, User, Item, Category, Ingredient } = require("./models");
const { genToken } = require("./helpers/jwt");
const bcrypt = require("bcrypt");

class Controller {
  static async register(req, res, next) {
    try {
      const { username, email, password, phoneNumber, address } = req.body;
      const role = "admin";
      const found = await User.findOne({
        where: {
          email,
        },
      });

      if (found) {
        throw { name: "accountExisted" };
      } else {
        const response = await User.create({
          username,
          email,
          password,
          role,
          phoneNumber,
          address,
        });
        const payload = {
          id: response.id,
          email: response.email,
        };
        res.status(201).json(payload);
      }
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      console.log(email, password);
      if (!email) throw { name: "badLoginReq" };
      if (!password) throw { name: "badLoginReq" };
      const foundUser = await User.findOne({
        where: {
          email,
        },
      });
      if (!foundUser) {
        throw { name: "unauthorizedLogin" };
      }

      const validPass = bcrypt.compareSync(password, foundUser.password);
      if (!validPass) throw { name: "unauthorizedLogin" };

      const payload = {
        id: foundUser.id,
        email: foundUser.email,
      };
      console.log(foundUser.dataValues);
      const access_token = genToken(payload);
      res.status(200).json({ access_token, email: foundUser.email });
    } catch (err) {
      next(err);
    }
  }

  static async getMenus(req, res, next) {
    try {
      const response = await Item.findAll({
        order: [
          ['id', 'ASC']
        ]
      });
      res.status(200).json({
        menu: response,
      });
    } catch (err) {
      next(err);
    }
  }

  static async postMenu(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { name, description, price, imgUrl, categoryName, ingredients } =
        req.body;
      console.log(req.body);
      const [category, created] = await Category.findOrCreate({
        where: { name: categoryName },
        transaction: t,
      });
      if (!category) throw err;

      const newItem = await Item.create(
        {
          name,
          description,
          price,
          imgUrl,
          authorId: req.user.id,
          categoryId: category.id,
        },
        { transaction: t }
      );
      if (!newItem) throw err;

      //   let ingredientsPayload = []
      //   ingredients.forEach((ingredient) => {
      //     let foundIngredient = Ingredient.findOne({where: {id: ingredient.id}})
      //     if (!foundIngredient) {
      //      ingredientsPayload.push(ingredient)
      //     } else {
      //      foundIngredient.itemId = newItem.id
      //      ingredientsPayload.push(foundIngredient)
      //     }
      //   })
      console.log("sampe sini");
      ingredients.map((ingredient) => {
        return (ingredient.itemId = newItem.id);
      });
      console.log("sampe sini 2");

      console.log(ingredients, "<<<<<<<<<<<<<<<");
      const newIngredients = await Ingredient.bulkCreate(ingredients, {
        transaction: t,
      });
      if (!newIngredients) throw err;

      const payload = {
        id: newItem.id,
        name: newItem.name,
        description: newItem.description,
        price: newItem.price,
        imgUrl: newItem.imgUrl,
        categoryName: category.name,
        ingredients: newIngredients,
      };

      await t.commit();
      res.status(201).json(payload);
    } catch (err) {
      await t.rollback();
      next(err);
    }
  }

  static async getMenuById(req, res, next) {
    try {
      const { id } = req.params;

      let menu = await Item.findByPk(id, {
        include: [
          {
            model: Category,
          },
        ],
      });
      if (!menu) throw { name: "reqNotFound" };

      const menuIngredients = await Ingredient.findAll({
        where: { itemId: id },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      const payload = {
        menu,
        ingredients: menuIngredients,
      };
      res.status(200).json(payload);
    } catch (err) {
      next(err);
    }
  }

  static async editMenu(req, res, next) {
    try {
      const { name, description, price, imgUrl, categoryName } = req.body;
      const { itemId } = req.params;

      const category = await Category.findOrCreate({
        where: { name: categoryName },
      });
      const updatedItem = await Item.update(
        {
          name,
          description,
          price,
          imgUrl,
          authorId: req.user.id,
          categoryId: category.id,
        },
        {
          where: { id: itemId },
          returning: true,
        }
      );
      console.log(updatedItem);
      const editedItem = updatedItem[1][0].dataValues;
      if (!editedItem) throw err;

      // const [category, created] = await Category.findOrCreate({
      //     where: {name: categoryName},
      //     transaction: t
      // })
      // if(!category) throw err
      // const foundItem = await Item.findByPk(itemId, {
      //   include: [
      //     {
      //       model: Category,
      //     },
      //     {
      //       model: User,
      //     },
      //     {
      //       model: Ingredient,
      //     }
      //   ]
      // })
      // if (!foundItem) throw {name: 'reqNotFound'}
      // const updatedItem = await Item.update(
      //   {
      //     name,
      //     description,
      //     price,
      //     imgUrl,
      //     authorId: req.user.id,
      //     categoryId: category.id
      //   },
      //   {
      //     where: { id: itemId },
      //     transaction: t,
      //     returning: true
      //   }
      // );
      // const editedItem = updatedItem[1][0].dataValues
      // console.log(updatedItem, '<<<<<<<<<<<<<<<<<<<< EDITED ITEM')
      // if (!editedItem) throw err;

      // let newlyAddedIngredients = []
      // let deletedIngredients = []
      // let payloadIngredients = []
      // await ingredients.forEach(ingredient => {
      //   const foundIngredient = Ingredient.findOne({where: {name: ingredient.name}})
      //   if(foundIngredient) {
      //     newlyAddedIngredients.push(ingredient)
      //   }
      //   if(!foundIngredient) {
      //     deletedIngredients.push(ingredient)
      //   }
      // })
      // await ingredients.map(ingredient => {
      //     return ingredient.itemId = editedItem.id
      // })

      // if(deletedIngredients !== 0) {
      //   const deleteIngredient =  await Ingredient.bulkDelete()
      // }
      // if(newlyAddedIngredients.length !== 0) {
      //   const newIngredients = await Ingredient.bulkCreate(newlyAddedIngredients, {transaction: t});
      //   if (!newIngredients) throw err;
      // }
      // const payload = {
      //   name: editedItem.name,
      //   description: editedItem.description,
      //   price: editedItem.price,
      //   imgUrl: editedItem.imgUrl,
      //   categoryName : category.name,
      //   ingredients: payloadIngredients,
      // };

      // await t.commit();

      res.status(200).json(editedItem);
    } catch (err) {
      // await t.rollback();
      next(err);
    }
  }

  static async deleteItem(req, res, next) {
    try {
      const { itemId } = req.params;

      const response = await Item.destroy({ where: { id: itemId } });
      console.log(response);
      res.status(200).json({ message: "Delete Success" });
    } catch (err) {
      next(err);
    }
  }

  static async deleteCategory(req, res, next) {
    try {
      const { categoryName } = req.body;
      const response = await Category.destroy({
        where: { name: categoryName },
      });
      res.status(200).json({ message: "Category deleted" });
    } catch (err) {
      next(err);
    }
  }

  static async deleteIngredient(req, res, next) {
    try {
      const { ingredientName } = req.body;
      const response = await Ingredient.destroy({
        where: { name: ingredientName },
      });

      res.status(200).json({ message: "Ingredient deleted" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;

const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const cors = require('cors')
const Controller = require('./controller')
const { errorHandler } = require('./middlewares/errorHandler')
const { auth } = require('./middlewares/auth')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.post('/register', Controller.register)
app.post('/login', Controller.login)
app.get('/pub/menus', Controller.getMenus)
app.get('/pub/menus/:id', Controller.getMenuById)
app.use(auth)
app.get('/menus', Controller.getMenus)
app.post('/menus', Controller.postMenu)
app.get('/menus/:id', Controller.getMenuById)
app.put('/menus/:itemId', Controller.editMenu)
app.delete('/menus/:itemId', Controller.deleteItem)
app.delete('/menus/categories', Controller.deleteCategory)
app.delete('/menus/ingredients', Controller.deleteIngredient)

app.use(errorHandler)
app.listen(port, () => {
    console.log(`listening to port ${port}`)
})
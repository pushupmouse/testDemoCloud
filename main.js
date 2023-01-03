var express = require('express')
const { insertNewProduct,getAllProducts,
    updateProduct,findProductById,deleteProductById,findProductByName } = require('./databaseHandler')
var app = express()

app.set('view engine','hbs')
app.use(express.urlencoded({extended:true}))

app.use(express.static('public'));

const hbs = require('hbs')
hbs.registerHelper("priceColor", function (price) {
    if (price >= 1000) return 'red'
    else if(price >= 100 && price < 1000) return 'orange'
    else return 'green'
})
hbs.registerHelper("quantityColor", function (quantity) {
    if (quantity == 0) return 'red'
})

app.post('/search',async (req,res)=>{
    const searchName = req.body.txtName
    const searchResult = await findProductByName(searchName)
    res.render('allProduct',{results:searchResult})
})

app.post('/edit',async(req,res)=>{
    const id = req.body.id
    const name = req.body.txtName
    const quantity = req.body.txtQuantity
    const price = req.body.txtPrice
    const picUrl = req.body.txtPic
    const category = req.body.txtCategory
    await updateProduct(id, name, quantity, price, picUrl, category)
    res.redirect('/all')
})

app.get('/edit',async(req,res)=>{
    const id = req.query.id
    const productToEdit = await findProductById(id)
    res.render("edit",{product:productToEdit})
})

app.get('/delete',async (req,res)=>{
    const id = req.query.id
    await deleteProductById(id)
    res.redirect('/all')
})

app.get('/all',async (req,res)=>{
    let results = await getAllProducts()
    res.render('allProduct',{results:results})
})

app.post('/new',async (req,res)=>{
    const name = req.body.txtName
    const quantity = req.body.txtQuantity
    const price = req.body.txtPrice
    const picUrl = req.body.txtPic
    const category = req.body.txtCategory
    if(name.length == 0 || quantity.length == 0 || price.length == 0 || picUrl.length == 0 || category.length == 0){
        res.render('newProduct', {'warning': "Please fill out all necessary fields"})
    }
    else{
        const newProduct = {
            name :name,
            quantity: quantity,
            price: Number.parseFloat(price),
            picture: picUrl,
            category: category
        }
        await insertNewProduct(newProduct)
        res.redirect('/all')
    }
})

app.get('/new',(req,res)=>{
    res.render('newProduct')
})

app.get('/',(req,res)=>{
    res.render('home')
})

const PORT = process.env.PORT || 3000
app.listen(PORT)
console.log("Server is running!")
import { Router } from "express";
import { socketServer } from "../app.js";
import ProductManagerDB from "../dao/ManagerDB/productManagerDB.js";
import { checkAuth, checkExistingUser } from "../middlewares/auth.js";

const viewsRoutes = Router()
const managerProduct = new ProductManagerDB()

/*viewsRoutes.get('/', async (req,res)=>{
    const result = await managerProduct.getProducts()
    if(result.message === 'ok'){
        res.render('home', {title:'home', data: result})
    }
})*/
viewsRoutes.get('/realtimeproducts', checkAuth,async (req,res)=>{
    const result = await managerProduct.getProducts()
    if(result.message === 'ok'){
        res.render('realTimeProducts', {title:'realTimeProducts', data: result.rdo})
    }
})
viewsRoutes.get('/products', checkAuth, async (req,res)=>{
    const {page}= req.query
    const {user} = req.session
    const products = await managerProduct.getProducts(10,page)    
    res.render('products', {products, user})
})
viewsRoutes.get('/register', checkExistingUser, (req,res)=>{
    res.render('register')
})
viewsRoutes.get('/login', checkExistingUser, (req,res)=>{
    const {user} = req.session
    res.render('login', user)
})
viewsRoutes.get('/', checkAuth,(req,res)=>{
    res.redirect('/products')
})
viewsRoutes.get('/failLogin', (req,res)=>{
    res.render('failLogin')
})
viewsRoutes.get('/failRegister', (req, res)=>{
    res.render('failRegister')
})
viewsRoutes.get('/userCreateSuccess', (req,res)=>{
    res.render('userCreateSuccess')
})

export default viewsRoutes
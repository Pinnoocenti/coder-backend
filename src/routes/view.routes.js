import { Router } from "express";
import { socketServer } from "../app.js";
import ProductManagerDB from "../dao/ManagerDB/productManagerDB.js";

const viewsRoutes = Router()
const managerProduct = new ProductManagerDB()

viewsRoutes.get('/', async (req,res)=>{
    const result = await managerProduct.getProducts()
    if(result.message === 'ok'){
        res.render('home', {title:'home', data: result})
    }
})
viewsRoutes.get('/realtimeproducts', async (req,res)=>{
    const result = await managerProduct.getProducts()
    if(result.message === 'ok'){
        res.render('realTimeProducts', {title:'realTimeProducts', data: result.rdo})
    }
})
viewsRoutes.get('/products', async (req,res)=>{
    const {page}= req.query
    const products = await managerProduct.getProducts(10,page)
    res.render('products', products)
})


export default viewsRoutes
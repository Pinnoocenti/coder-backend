import { Router } from "express";
import { socketServer } from "../app.js";
import { productManager } from "./products.routes.js";

const viewsRoutes = Router()

viewsRoutes.get('/', (req,res)=>{
    res.render('realTimeProducts', {title:'realTimeProducts'})
})
viewsRoutes.post('/', async (req,res)=>{
    const product = req.body
    const productCreated = await productManager.addProduct(product)

    if(productCreated && productCreated.id){
        const products = await productManager.getProducts()
        console.log('adentro del productCreated ' + products.length)
        socketServer.emit('updateProducts', { products })
        res.render('realTimeProducts', {title:'realTimeProducts'})
    } else {
        return res.status(400).send('Product could not be added')
    }
})


export default viewsRoutes
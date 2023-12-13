import { Router } from "express";
import ProductManager from "../ProductManager.js";

const productManager = new ProductManager('./products.json')
const productsRouter = Router()


productsRouter.get('/', async (req, res)=>{
    const products = await productManager.getProducts()
    let {limit } = req.query
    if(!limit){
        return res.send(products)
    }
    limit = parseInt(limit)
    if(isNaN(limit)){
        return res.status(400).send('Limit must be a number')
    }
    const limitedProducts = products.slice(0, limit)
    res.send(limitedProducts)
})

productsRouter.get('/:pid', async (req, res)=>{
    let {pid} = req.params
    pid = parseInt(pid)
    if(isNaN(pid)){
        return res.status(400).send('The id must be a number')
    }
    const product = await productManager.getProductById(pid)
    res.send(product)
})

productsRouter.post('/', async (req,res)=>{
    const product = req.body
    const productCreated = await productManager.addProduct(product)
    if(productCreated && productCreated.id){
        res.send(productCreated)
    } else {
        return res.status(400).send('Product could not be added')
    }
})
productsRouter.put('/:pid', async (req,res)=>{
    let {pid} = req.params
    pid = parseInt(pid)
    if(isNaN(pid)){
        return res.status(400).send('The id must be a number')
    }
    const productToModify = req.body
    const modifiedProduct = await productManager.updateProduct(pid, productToModify)
    if(modifiedProduct){
        res.send(modifiedProduct)
    } else {
        return res.status(400).send('Product could not be modified')
    }
})
productsRouter.delete('/:pid', async (req, res)=>{
    let {pid} = req.params
    pid = parseInt(pid)
    if(isNaN(pid)){
        return res.status(400).send('The id must be a number')
    }
    await productManager.deleteProduct(pid)
    res.send({massege: 'The product was removed'})
})



export default productsRouter
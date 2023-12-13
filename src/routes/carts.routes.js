import { Router } from "express";
import CartManager from "../CartManager.js";


const cartsRouter = Router()
const cartManager = new CartManager('./carts.json')


cartsRouter.get('/', async (req,res)=>{
    const carts = await cartManager.getCarts()
    res.send(carts)
})
cartsRouter.post('/', async (req,res)=>{
    try{
        const newCart = await cartManager.addCart()
        res.send(newCart)
    } catch (error) {
        console.error('Error adding cart:', error.message)
        res.status(500).send('Internal Server Error')
    }
    
})
cartsRouter.get('/:cid', async (req,res)=>{
    let {cid} = req.params
    cid = parseInt(cid)
    if(isNaN(cid)){
        return res.status(400).send('The id must be a number')
    }
    const cart = await cartManager.getCartById(cid)
    res.send(cart)
})
cartsRouter.post('/:cid/product/:pid', async (req,res)=>{
    let {cid} = req.params
    cid = parseInt(cid)
    if(isNaN(cid)){
        return res.status(400).send('The cid must be a number')
    }
    let {pid} = req.params
    pid = parseInt(pid)
    if(isNaN(pid)){
        return res.status(400).send('The pid must be a number')
    }
    const addedProduct = await cartManager.addProduct(cid, pid)
    res.send({message: 'The product was added', addedProduct})
})


export default cartsRouter
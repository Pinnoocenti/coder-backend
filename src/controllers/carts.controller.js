import cartDAO from "../dao/Manager/cartDAO.js"
import productDAO from "../dao/Manager/productDAO.js"
import ticketDAO from "../dao/Manager/ticketDAO.js"
import userDAO from "../dao/Manager/userDAO.js"
import MyError from "../errors/myError.js"
import ErrorEnum from "../errors/error.enum.js"
import { notFound } from "../errors/info.js"

export const getCartsController = async (req,res,next)=>{
    try {
        const result= await cartDAO.getCarts()
        if(result && result.length > 0){
            return res.status(200).json(result)
        }
        throw new MyError({
            name: 'Cart not found', 
            cause: notFound(),
            message: 'Error - Cart not found',
            code: ErrorEnum.NOT_FOUND,
        })
    } catch (error) {
        next(error)
    }
}
export const postCartController = async (req,res)=>{
    try{
        const result = await cartDAO.addCart({products: []})
         return res.status(200).json(result)
    } catch (error) {
        throw error
    }
}
export const getCartByIdController = async (req,res, next)=>{
    let {cid} = req.params
    try {
        const result = await cartDAO.getProductsCartById(cid)
        if(result){
            return res.status(200).json(result)
        }
        throw new MyError({
            name: 'The cart does not exist or does not have products', 
            cause: notFound(),
            message: 'Error - Cart not found',
            code: ErrorEnum.NOT_FOUND,
        })
    } catch (error) {
        next(error)
    }
}
export const postProductInCartController = async (req,res)=>{
    try {
        console.log('holaaaa')
        const {pid} = req.params
        let role = req.session.user.role
        let email = req.session.user.email
        console.log('role', role)
        console.log('email', email)
        if(role === 'premium'){
            const product = await productDAO.getProductById(pid)
            console.log(product)
            console.log(product.rdo.owner)
            if(product.rdo.owner === email){
                return res.status(400).send({message: 'You can not add this product because you are the owner'})
            }
        }
        const newQuantity = req.body.quantity ?? 1
        let cart = req.session.user.cart
        console.log('req.session.user._id ', req.session.user)
        if(!cart) {
            const cartAdded = await cartDAO.addCart({products: []})
            cart = cartAdded
            console.log('cartAdded ', cart)
            userDAO.update(req.session.user._id, {cart: cart._id})
            req.session.user.cart = cart
            req.session.save()
        }
        console.log(cart)
        const result = await cartDAO.addProducts(cart._id, pid, newQuantity)
        if(result){
            return res.status(200).json({result, cartId:cart._id})
        }
        res.status(400).json({message: 'could not add product'})
    } catch (error) {
        res.status(400).send({error})
    }
}
export const deleteProductInCartController = async (req,res)=>{ //falta en fs
    const {cid, pid} = req.params
    try {
        const result = await cartDAO.deleteProductInCart(cid, pid)
        if(result){
            res.send({message: 'product deleted'})
        }else{
            res.status(400).json({message: 'could not delete product'})
        }
    } catch (error) {
        res.status(400).json({message: '2 could not delete product'})
    }
}
export const updateCartController = async (req,res)=>{ //falta en fs
    const {cid} = req.params
    const cart = req.body
    
    try {
        const result = await cartDAO.updateCart(cid, cart)
        if(result.modifiedCount > 0){
            res.send({message: 'Cart updated'});
        }else{
            res.status(400).send({message: 'Could not update cart'})
        }
    } catch (error) {
        res.status(400).json({messaje: 'could not update cart'})
    }
}
export const updateProductInCart = async (req,res)=>{ //falta en fs
    const {cid, pid} = req.params
    const {quantity} = req.body
    try {
       
       const result = await cartDAO.updateProductInCart(cid, pid, quantity)
       if(result){
        return res.send({message: 'product updated'})
       }else{
        res.status(400).send({message: 'could not update product'})
       }
    } catch (error) {
        res.status(400).json({message:' could not updated'})
    }
}
export const deleteAllProductsInCartController = async (req,res)=>{ //falta en fs
    const {cid}= req.params
    try {
        const deleted = await cartDAO.deleteAllProductsInCart(cid)
        if(deleted){
            res.status(200).json({message: 'products deleted'})
        } else{
            return res.status(404).json({menssage: 'could not delete products'})
        }
    } catch (error) {
        res.status(400).json({message: error})
    }
}
export const postPurchase = async (req,res)=>{ //falta el fs
    try {
        const {cid} = req.params
        const {user} = req.session
        console.log('user:', user)
        let amount = 0
        let noStockProducts = []

        const cart = await cartDAO.getCartById(cid)
        if(!cart){
            res.status(404).json({message: 'Cart not found'})
        }

        await Promise.all(
            cart.products.map(async (product) => {
                const searchedProduct = await productDAO.getProductById(product.product)
                if(searchedProduct.stock >= product.quantity){
                    let newStock = searchedProduct.stock - product.quantity
                    await productDAO.updateProduct(searchedProduct._id, {stock: newStock})
                    amount += searchedProduct.price * product.quantity
                    await cartDAO.deleteProductInCart(cid, product.product)
                } 
                noStockProducts.push(searchedProduct)
                await cartDAO.deleteProductInCart(cid, product.product)
            }) 
        )
        
        if(amount === 0){
            return res.send({noStockProducts})
        }
                
        const ticket = await ticketDAO.createTicket(amount, user.email)
        console.log(ticket)
        return res.send({message: 'Ticket created', ticket})
        
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}
import CartManagerDB from "../dao/ManagerDB/cartManagerDB.js";

export const getCartsController = async (req,res)=>{
    try {
        const carts = new CartManagerDB()
        const result= await carts.getCarts()

        if(result.message === 'ok'){
            return res.status(200).json(result)
        }
        res.status(400).json(result)
    } catch (error) {
        res.status(400).json({ message: "There was an error getting the carts" + error.menssage })
    }
}
export const postCartController = async (req,res)=>{
    try{
        const cart = new CartManagerDB() 
        const result = await cart.addCart({products: []})
        if(result.message === 'ok'){
            return res.status(200).json(result)
        }
        res.status(400).json(result)
    } catch (error) {
        res.status(400).json({message: error})
    }
}
export const getCartByIdController = async (req,res)=>{
    let {cid} = req.params
    try {
        const cart = new CartManagerDB() 
        const result = await cart.getProductsCartById(cid)

        if(result.message === 'ok'){
            return res.status(200).json(result)
        }
        res.status(400).json(result)
    } catch (error) {
        res.status(400).json({message: "The cart does not exist"})
    }
}
export const postProductInCartController = async (req,res)=>{
    try {
        const {cid, pid} = req.params
        const newQuantity = req.body.quantity
        const cart = new CartManagerDB()

        const result = await cart.addProducts(cid, pid, newQuantity)
        if(result){
            return res.status(200).json({message: 'Product added'})
        }
        res.status(400).json({message: 'could not add product'})
    } catch (error) {
        res.status(400).send({error})
    }
}
export const deleteProductInCartController = async (req,res)=>{
    const {cid, pid} = req.params
    try {
        const cart = new CartManagerDB()
        const result = await cart.deleteProductInCart(cid, pid)
        if(result){
            res.send({message: 'product deleted'})
        }else{
            res.status(400).json({message: 'could not delete product'})
        }
    } catch (error) {
        res.status(400).json({message: '2 could not delete product'})
    }
}
export const updateCartController = async (req,res)=>{
    const {cid} = req.params
    const cart = req.body
    const cartManager = new CartManagerDB()
    try {
        const result = await cartManager.updateCart(cid, cart)
        if(result.modifiedCount > 0){
            res.send({message: 'Cart updated'});
        }else{
            res.status(400).send({message: 'Could not update cart'})
        }
    } catch (error) {
        res.status(400).json({messaje: 'could not update cart'})
    }
}
export const updateProductInCart = async (req,res)=>{
    const {cid, pid} = req.params
    const {quantity} = req.body
    try {
       const cartManager =  new CartManagerDB()
       const result = await cartManager.updateProductInCart(cid, pid, quantity)
       if(result){
        return res.send({message: 'product updated'})
       }else{
        res.status(400).send({message: 'could not update product'})
       }
    } catch (error) {
        res.status(400).json({message:' could not updated'})
    }
}
export const deleteAllProductsInCartController = async (req,res)=>{
    const {cid}= req.params
    try {
        const cart = new CartManagerDB() 
        const deleted = await cart.deleteAllProductsInCart(cid)
        if(deleted){
            res.status(200).json({message: 'products deleted'})
        } else{
            return res.status(404).json({menssage: 'could not delete products'})
        }
    } catch (error) {
        res.status(400).json({message: error})
    }
}
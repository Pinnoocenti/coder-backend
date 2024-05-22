import productDAO from "../dao/Manager/productDAO.js";
import jwt from 'jsonwebtoken'
import { getVariables } from "../config/config.js";
import { Command } from 'commander'
import { use } from "chai";
import userDAO from "../dao/Manager/userDAO.js";
import { postPurchase } from "./carts.controller.js";
import cartDAO from "../dao/Manager/cartDAO.js";
import { logger } from "../utils/logger.js";



const program = new Command()
const options = program.parse()

const { secretPassword} = getVariables(options)


export const getRealtimeproductsController = async (req,res)=>{
    const products = await productDAO.getProductsHome()
    if(products){
        res.render('realTimeProducts', {title:'realTimeProducts', products})
    }
}
export const getViewsProductsController = async (req,res)=>{
    const {page}= req.query
    const {user} = req.session
    const products = await productDAO.getProducts(10,page)    
    res.render('products', {products, user})
}
export const gethome = async (req,res)=>{
    const products = await productDAO.getProductsHome()   
    res.render('home', {products})
}

export const getRegisterController = (req,res)=>{
    res.render('register')
}
export const getLoginController = (req,res)=>{
    const {user} = req.session
    res.render('login', user)
}
export const getViewsController = (req,res)=>{
    res.redirect('/products')
}
export const getFailLoginController =(req,res)=>{
    res.render('failLogin')
}
export const getFailRegisterController = (req, res)=>{
    res.render('failRegister')
}
export const getUserCreateSuccessController = (req,res)=>{
    res.render('userCreateSuccess')
}
export const getChat = (req,res)=>{
    res.render('chat')
}
export const getResetPassword = (req,res)=>{
    res.render('resetpassword')
}
export const getFailemail = (req,res)=>{
    res.render('failemail')
}
export const getChangePassword = (req,res)=>{
    const token = req.query.token
    if(!token){
        return res.render('expiredlink')
    }   
    try {
        const decoded = jwt.verify(token, secretPassword);
        res.render('changepassword');

    } catch (error) {
        req.logger.error(error)
        return res.render('expiredlink')
    }
}
export const getExpiredlink = (req,res)=>{
    res.render('expiredlink')
}
export const getUpload = (req,res)=>{
    const {user} = req.session
    req.logger.info(user)
    res.render('uploadDocument', {user})
}
export const usersView = async (req,res) =>{
    const users = await userDAO.getUsers()
    res.render('usersView', {users})
}
export const cart = async ( req,res)=>{
    const searchedCart = req.session.user.cart
    const cart = await cartDAO.getCartById(searchedCart)
    req.logger.info(cart)
    const products = []
    await Promise.all(
        cart.products.map(async (product) =>{
            const quantity = product.quantity
            const searchedProduct = await productDAO.getProductById(product.product)
            products.push({product: searchedProduct, quantity, cid: searchedCart})
        })
    ) 
    
    res.render('cart', {products, cid: cart._id})
}
export const addProduct = async (req,res)=>{
    res.render('addProduct')
}


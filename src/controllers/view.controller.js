import productDAO from "../dao/Manager/productDAO.js";
import jwt from 'jsonwebtoken'
import { getVariables } from "../config/config.js";
import { Command } from 'commander'
import { use } from "chai";

const program = new Command()
const options = program.parse()

const { secretPassword} = getVariables(options)

export const getRealtimeproductsController = async (req,res)=>{
    const result = await productDAO.getProducts()
    if(result.message === 'ok'){
        res.render('realTimeProducts', {title:'realTimeProducts', data: result.rdo})
    }
}
export const getViewsProductsController = async (req,res)=>{
    const {page}= req.query
    const {user} = req.session
    const products = await productDAO.getProducts(10,page)    
    res.render('products', {products, user})
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
        return res.render('expiredlink')
    }
}
export const getExpiredlink = (req,res)=>{
    res.render('expiredlink')
}
export const getUpload = (req,res)=>{
    const {user} = req.session
    console.log(user)
    res.render('uploadDocument', {user})
}

import productDAO from "../dao/Manager/productDAO.js";


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

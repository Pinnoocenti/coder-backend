import { Router } from "express";
import { checkAuth, checkExistingUser,authorization } from "../middlewares/auth.js";
import { getChangePassword, getChat, getExpiredlink, getFailLoginController, getFailRegisterController, getFailemail, getLoginController, getRealtimeproductsController, getRegisterController, getResetPassword, getUserCreateSuccessController, getViewsController, getViewsProductsController, getUpload, usersView, cart, gethome, addProduct } from "../controllers/view.controller.js";

const viewsRoutes = Router()

viewsRoutes.get('/uploadDocument',checkAuth, getUpload)
viewsRoutes.get('/failLogin', getFailLoginController)
viewsRoutes.get('/failRegister', getFailRegisterController)
viewsRoutes.get('/userCreateSuccess', getUserCreateSuccessController)
viewsRoutes.get('/chat', checkAuth, getChat)
viewsRoutes.get('/resetpassword', getResetPassword)
viewsRoutes.get('/failemail',getFailemail)
viewsRoutes.get('/changepassword', getChangePassword)
viewsRoutes.get('/expiredlink', getExpiredlink)
viewsRoutes.get('/realtimeproducts', checkAuth,getRealtimeproductsController)
viewsRoutes.get('/uploadDocument',checkAuth, getUpload)
viewsRoutes.get('/home', checkAuth, gethome)
viewsRoutes.get('/products', checkAuth, getViewsProductsController)
viewsRoutes.get('/register', checkExistingUser, getRegisterController)
viewsRoutes.get('/login', checkExistingUser, getLoginController)
viewsRoutes.get('/', checkAuth,getViewsController)
viewsRoutes.get('/cart',checkAuth, cart)
viewsRoutes.get('/addProduct', authorization(['admin', 'premium']),addProduct)
viewsRoutes.get('/usersView', authorization(['admin']), usersView)


export default viewsRoutes
import { Router } from "express";
import { checkAuth, checkExistingUser } from "../middlewares/auth.js";
import { getChat, getFailLoginController, getFailRegisterController, getLoginController, getRealtimeproductsController, getRegisterController, getUserCreateSuccessController, getViewsController, getViewsProductsController } from "../controllers/view.controller.js";

const viewsRoutes = Router()

viewsRoutes.get('/realtimeproducts', checkAuth,getRealtimeproductsController)
viewsRoutes.get('/products', checkAuth, getViewsProductsController)
viewsRoutes.get('/register', checkExistingUser, getRegisterController)
viewsRoutes.get('/login', checkExistingUser, getLoginController)
viewsRoutes.get('/', checkAuth,getViewsController)
viewsRoutes.get('/failLogin', getFailLoginController)
viewsRoutes.get('/failRegister', getFailRegisterController)
viewsRoutes.get('/userCreateSuccess', getUserCreateSuccessController)
viewsRoutes.get('/chat', checkAuth, getChat)

export default viewsRoutes
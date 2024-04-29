import { Router } from "express";
import { deleteAllProductsInCartController, deleteProductInCartController, getCartByIdController, getCartsController, postCartController, postProductInCartController, postPurchase, updateCartController, updateProductInCart } from "../controllers/carts.controller.js";
import { checkAuth, authorization } from "../middlewares/auth.js";

const cartsRouter = Router()

cartsRouter.get('/', getCartsController)
cartsRouter.post('/' ,postCartController)
cartsRouter.get('/:cid', getCartByIdController)
cartsRouter.delete('/:cid/product/:pid', deleteProductInCartController)
cartsRouter.put('/:cid', updateCartController)
cartsRouter.put('/:cid/product/:pid', updateProductInCart)
cartsRouter.delete('/:cid', deleteAllProductsInCartController)
cartsRouter.post('/:cid/purchase',postPurchase)
cartsRouter.post('/product/:pid', authorization(['user', 'premium']) ,postProductInCartController)


export default cartsRouter
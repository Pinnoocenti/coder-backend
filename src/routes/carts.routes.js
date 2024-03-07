import { Router } from "express";
import { deleteAllProductsInCartController, deleteProductInCartController, getCartByIdController, getCartsController, postCartController, postProductInCartController, updateCartController, updateProductInCart } from "../controllers/carts.controller.js";

const cartsRouter = Router()

cartsRouter.get('/', getCartsController)
cartsRouter.post('/' ,postCartController)
cartsRouter.get('/:cid', getCartByIdController)
cartsRouter.post('/:cid/product/:pid', postProductInCartController)
cartsRouter.delete('/:cid/product/:pid', deleteProductInCartController)
cartsRouter.put('/:cid', updateCartController)
cartsRouter.put('/:cid/product/:pid', updateProductInCart)
cartsRouter.delete('/:cid', deleteAllProductsInCartController)

export default cartsRouter
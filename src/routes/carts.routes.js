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
cartsRouter // la ruta para que se elimine el carrito cuando se confirme que hay stock de todos los productos y se confirme la compra 

export default cartsRouter
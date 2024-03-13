import { Router } from "express";
import { authorization, checkAuth, checkExistingUser } from "../middlewares/auth.js";
import { addProductController, deleteProductController, getProductByIdController, getProductsController, updateProducstController } from "../controllers/products.controller.js";

const productsRouter = Router()

productsRouter.get('/', authorization('user'),checkExistingUser, getProductsController)
productsRouter.get('/:pid', authorization('user'), getProductByIdController)
productsRouter.post('/', authorization('admin'),addProductController)
productsRouter.put('/:pid', authorization('admin'),updateProducstController)
productsRouter.delete('/:pid', authorization('admin'),deleteProductController)

export default productsRouter
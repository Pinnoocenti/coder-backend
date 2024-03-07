import { Router } from "express";
import { checkAuth, checkExistingUser } from "../middlewares/auth.js";
import { addProductController, deleteProductController, getProductByIdController, getProductsController, updateProducstController } from "../controllers/products.controller.js";

const productsRouter = Router()

productsRouter.get('/', checkExistingUser, getProductsController)
productsRouter.get('/:pid', getProductByIdController)
productsRouter.post('/', addProductController)
productsRouter.put('/:pid', updateProducstController)
productsRouter.delete('/:pid', deleteProductController)

export default productsRouter
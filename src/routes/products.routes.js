import { Router } from "express";
import { authorization, checkAuth, checkExistingUser } from "../middlewares/auth.js";
import { addProductController, deleteProductController, getProductByIdController, getProductsController, updateProducstController,getMockingProducts } from "../controllers/products.controller.js";

const productsRouter = Router()

productsRouter.get('/mockingproducts', getMockingProducts )
productsRouter.get('/', authorization(['user','premium']),checkExistingUser, getProductsController)
productsRouter.get('/:pid', authorization(['user','premium']), getProductByIdController)
productsRouter.post('/', authorization(['admin','premium']),addProductController)
productsRouter.put('/:pid', authorization(['admin','premium']),updateProducstController)
productsRouter.delete('/:pid', authorization(['admin','premium']),deleteProductController)

export default productsRouter
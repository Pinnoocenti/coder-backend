import { Router } from "express";
import { authorization, checkAuth, checkExistingUser } from "../middlewares/auth.js";
import { addProductController, deleteProductController, getProductByIdController, getProductsController, updateProducstController,getMockingProducts } from "../controllers/products.controller.js";
import { uploader } from "../utils/multer.js";

const productsRouter = Router()

productsRouter.get('/mockingproducts', getMockingProducts )
productsRouter.get('/', authorization(['user','premium']),checkExistingUser, getProductsController) 
productsRouter.get('/:pid', authorization(['user','premium']), getProductByIdController) 
productsRouter.post('/', authorization(['admin','premium']), uploader.single('thumbnail'), addProductController)
productsRouter.put('/:pid', authorization(['admin','premium']),updateProducstController)
productsRouter.delete('/:pid', authorization(['admin','premium']), deleteProductController)

export default productsRouter
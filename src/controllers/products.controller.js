import ProductManagerDB from "../dao/ManagerDB/productManagerDB.js";
import { uploader } from "../utils/multer.js";
import ProductDTO from "../dao/dto/product.dto.js";


export const getProductsController = async (req, res)=>{ 
    try{
        const {limit = 10, page = 1, query = '', sort = ''} = req.query
        const products = new ProductManagerDB()
        const result = await products.getProducts(limit, page, query, sort)
        if(result){
            res.send(result)
        }else{
            res.status(400).json({message: 'Not found'})
        }
    } catch(error){
        res.status(400).json({message:'Something went wrong' + error.message})
    }
}
export const getProductByIdController = async (req, res)=>{
    try {
        const {pid} = req.params
        const product = new ProductManagerDB()
        const result = await product.getProductById(pid)

        if(result.message === 'ok'){
            return res.status(200).json(result)
        }
        res.send(product)
    } catch (error) {
        res.status(400).json({message: 'The products does not exist'})
    }
}
export const addProductController = /*uploader.single('file'),*/ async (req,res)=>{
    try {
        const newProduct = new ProductDTO(req.body)
        const product = new ProductManagerDB()
        //const path = req.file.path.split('public').join('')
        //await product.addProduct({...newProduct/*, thunbnail: path*/}) 
        const result = await product.addProduct(newProduct)
        if(result.message==='ok'){
            return res.status(201).json({message: 'Product added'})
        }
        res.status(400).json(result)
    } catch (error) {
        res.status(400).send(error)
    }
}
export const updateProducstController = async (req,res)=>{

    try {
        let {pid} = req.params
        const productToModify = req.body
        const products = new ProductManagerDB()
        
        const result = await products.updateProduct(pid, productToModify)
        if(result.message === 'ok'){
            return res.status(200).json(result)
        }
        res.status(400).json(result)
        
    } catch (error) {
        res.status(400).send(error)
    }
}
export const deleteProductController = async (req, res)=>{
    let {pid} = req.params
    try {
        const product = new ProductManagerDB()
        const deleted = await product.deleteProduct(pid)
        if (deleted.message==='ok'){
            return res.status(200).json(deleted.rdo)
        }
        return res.status(404).json(deleted.rdo)
    } catch (error) {
        res.status(400).json({message: 'eror'})
    }
}
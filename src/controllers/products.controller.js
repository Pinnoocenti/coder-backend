import { uploader } from "../utils/multer.js";
import ProductDTO from "../dao/dto/product.dto.js";
import productDAO from "../dao/Manager/productDAO.js";
import { generateProduct } from "../utils/mock.js";



export const getProductsController = async (req, res)=>{ 
    try{
        const {limit = 10, page = 1, query = '', sort = ''} = req.query
        const result = await productDAO.getProducts(limit, page, query, sort)
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
        const result = await productDAO.getProductById(pid)

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
        //const path = req.file.path.split('public').join('')
        //await product.addProduct({...newProduct/*, thunbnail: path*/}) 
        const result = await productDAO.addProduct(newProduct)
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
        const result = await productDAO.updateProduct(pid, productToModify)
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
        const deleted = await productDAO.deleteProduct(pid)
        if (deleted.message==='ok'){
            return res.status(200).json(deleted.rdo)
        }
        return res.status(404).json(deleted.rdo)
    } catch (error) {
        res.status(400).json({message: 'eror'})
    }
}
export const getMockingProducts = (req,res) =>{
    const products = []
    for(let i= 0; i <100; i++){
        products.push(generateProduct()) 
    }
    res.send(products)
}
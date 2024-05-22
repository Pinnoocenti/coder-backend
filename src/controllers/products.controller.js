import { uploader } from "../utils/multer.js";
import ProductDTO from "../dao/dto/product.dto.js";
import productDAO from "../dao/Manager/productDAO.js";
import { generateProduct } from "../utils/mock.js";
import MailingService from "../services/mailing.js";
import { logger } from "../utils/logger.js";



export const getProductsController = async (req, res) => {
    try {
        const { limit = 10, page = 1, query = '', sort = '' } = req.query
        const result = await productDAO.getProducts(limit, page, query, sort)
        if (result) {
            res.send(result)
        } else {
            res.status(400).json({ message: 'Not found' })
        }
    } catch (error) {
        res.status(400).json({ message: 'Something went wrong' + error.message })
    }
}
export const getProductByIdController = async (req, res) => {
    try {
        const { pid } = req.params
        const result = await productDAO.getProductById(pid)

        if (result) {
            return res.status(200).json(result)
        }
        res.send(result.message)
    } catch (error) {
        res.status(400).json({ message: 'The products does not exist' })
    }
}
export const addProductController =  async (req, res) => {
    try {
        req.logger.info('file ',req.file)
        const newProduct = new ProductDTO(req.body)
        if (req.file) {
            newProduct.thumbnail = req.file.path.split('public')[1]
        }
        let role = req.session.user.role
        if (role === 'premium') {
            newProduct.owner = req.session.user.email
        }
        const result = await productDAO.addProduct(newProduct)
        if (result) {
            return res.status(201).json(result)
        }
        res.status(400).json(result.message)
    } catch (error) {
        res.status(400).send(error)
    }
}
export const updateProducstController = async (req, res) => {

    try {
        let { pid } = req.params
        const productToModify = req.body

        const role = req.session.user.role
        const email = req.session.user.email

        if (role === 'premium') {
            const product = await productDAO.getProductById(pid)
            if(product.message === 'error'){
                return res.status(404).send({ error: 'Product not found' })
            }
            if (product.rdo.owner !== email) {
                return res.status(403).send({ error: 'You can not update a product that is not yours' })
            }
        }
        const result = await productDAO.updateProduct(pid, productToModify)
        if (result.message === 'ok') {
            return res.status(200).json(result)
        }
        res.status(400).json(result)

    } catch (error) {
        req.logger.error(error)
        res.status(400).send(error)
    }
}
export const deleteProductController = async (req, res) => {
    let { pid } = req.params
    try {
        const role = req.session.user.role
        const email = req.session.user.email
        const product = await productDAO.getProductById(pid)
        if (role === 'premium') {
            if(product.message === 'error'){
                return res.status(404).send({ message: 'Product not found' })
            }
            if (product.rdo.owner !== email) {
                return res.status(403).send({ message: 'You can not delete a product that is not yours' })
            }
        }
        const deleted = await productDAO.deleteProduct(pid)

        if (deleted.message === 'ok') {
            const mailingService = new MailingService()
            await mailingService.sendSimpleMail({
            from: 'Coder Ecommerce',
            to: product.owner,
            subject: 'Producto eliminado',
            html: `
                
                <h3>Le informamos que su producto: </h3> 
                    <div>
                        <h4>Titulo: ${product.title} </h4> 
                        <h4>Descripción: ${product.description} </h4> 
                        <h4>Código: ${product.code} </h4> 
                    </div>
                <h3>ha sido eliminado </h3>     
            `
        })
            return res.status(200).json(deleted.rdo)
        }
        return res.status(404).json(deleted.rdo)
    } catch (error) {
        res.status(400).json({ message: 'eror' })
    }
}
export const getMockingProducts = (req, res) => {
    const products = []
    for (let i = 0; i < 100; i++) {
        products.push(generateProduct())
    }
    res.send(products)
}
import { addProductError } from "../../errors/info.js"
import { productModel } from "../models/product.model.js"
import ErrorEnum from "../../errors/error.enum.js"
import MyError from "../../errors/myError.js"

class ProductManagerDB {
    async getProducts(limit = 10, page = 1, query = '', sort = '') {
        try {

            const [code, value] = query.split(':')
            const productsData = await productModel.paginate({ [code]: value }, {
                limit,
                page,
                sort: sort ? { price: sort } : {}
            })
            productsData.payload = productsData.docs
            delete productsData.docs
            return { message: "ok", ...productsData }

        } catch (error) {
            return { message: "error", rdo: "There are no products" }
        }
    }
    async getProductsHome() {
        try {
            const productsData = await productModel.find()
            if(productsData){
                return {message: 'OK', products: productsData}
            }
            return { message: "error - The product does not exist"}

        } catch (error) {
            return { message: "error", rdo: "There are no products" }
        }
    }

    async addProduct(product) {
        try {
            let searchedProduct = []
            
            console.log(product)
            const validation = (!product.title || !product.description || !product.price || !product.code || !product.stock || !product.category) || (typeof product.title !== 'string' || typeof product.description !== 'string' || typeof product.price !== 'number' /*|| typeof product.thumbnail !== String*/ || typeof product.code !== 'string'|| typeof product.stock !== 'string'|| typeof product.category !== 'string' || typeof product.status !== 'string' || typeof product.available !== 'string')
            
            if (validation) {
                throw new MyError({
                    name: 'Product creation fails', 
                    cause: addProductError(validation),
                    message: 'Error - there are incomplete fields or the data type is incorrect',
                    code: ErrorEnum.INVALID_TYPE_ERROR,
                })
            }
            const products = await this.getProducts()
        
            if (products.message === "ok") {
                searchedProduct = products.payload.find((e) => e.code === product.code);
            } else {
                return { message: 'error', rdo: "There was an error when obtaining the product" }
            }
            if (searchedProduct) {
                return { message: 'error', rdo: 'The product code already exists' };
            }
        
            const addedProduct = await productModel.create(product)
            console.log(addedProduct)
            return addedProduct
        } catch (error) {
            console.log(error)
            throw error;
        }
    }
    async getProductById(pid) {
        try {
            const product = await productModel.findOne({ _id: pid })
            
            if (product) {
                return product
            } else {
                return { message: "error - The product does not exist"}
            }
        } catch (error) {
            return { message: "error", rdo: " There was an error when obtaining the product " + error.message }
        }
    }
    async updateProduct(pid, productToModify) {
        try {
            console.log(productToModify)
            const update = await productModel.updateOne({ _id: pid }, productToModify)
            if(update.modifiedCount>0) {
                
                return { message: 'ok', rdo: 'product modified' }
            }
            return { message: 'error', rdo: 'product not found' }
        } catch (error) {
            return { message: 'error', rdo: 'there was an error updating the product' }
        }
    }
    async deleteProduct(pid) {
        try {
            const deleted = await productModel.deleteOne({ _id: pid })

            if (deleted.deletedCount === 0) {
                return { message: 'error', rdo: 'The product was not found' }
            }

            return { message: 'ok', rdo: 'Product deleted' }
        } catch (error) {
            return { message: 'error', rdo: 'There was a problem deleting the product' }
        }
    }
}
export default ProductManagerDB

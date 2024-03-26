import { productModel } from "../models/product.model.js"

class ProductManagerDB {
    /*constructor(title, description, price, code, stock,status, category, thunbnail){
        this.title= title
        this.description = description
        this.price = price
        this.code = code
        this.stock = stock
        this.status = status
        this.category = category
        this.thunbnail = thunbnail
    }*/
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

    async addProduct(product) {
        try {
            let searchedProduct = []
            
            const validation = !product.title && !product.description && !product.price && !product.code && !product.stock && !product.category

            if (validation) {
                return { message: 'error', rdo: 'Incomplete product' }
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
            const added = await productModel.create(product)
            return { message: 'The product was added'}
        } catch (error) {
            console.log('hubo un error')
            return { message: "error", rdo: "There was an error adding product - " + error.message }
        }
    }
    async getProductById(pid) {
        try {
            const product = await productModel.findOne({ _id: pid })
            
            if (product) {
                return { message: "ok", rdo: product }
            } else {
                return { message: "error", rdo: "The product does not exist" }
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
                return { message: 'error', rdo: 'Tthe product was not found' }
            }

            return { message: 'ok', rdo: 'Product deleted' }
        } catch (error) {
            return { message: 'error', rdo: 'There was a problem deleting the product' }
        }
    }
}
export default ProductManagerDB

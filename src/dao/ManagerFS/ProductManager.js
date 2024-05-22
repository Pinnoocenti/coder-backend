const fs = require('fs');

class ProductManager {
    constructor(path){
        this.path = path
    }
    static id = 0
    async getProducts(){ 
        try{
            const productsData = await fs.promises.readFile(this.path, 'utf-8')
            const parseData = JSON.parse(productsData) 
            return parseData
        } catch (error){
            console.error('There are no products')
            return []
        }
    }
    async addProduct({title, description, price, thumbnail, code, stock, category, status = true, available}){ 
        if(available === undefined || available === null){
            return console.log('Available is not complete')
        }
        if(!title || !description || !price || !code || !stock || !category){
            return console.log('Incomplete product')
        }
        const products = await this.getProducts()
        ProductManager.id++
        const product = {
            id: ProductManager.id,
            title, 
            description,
            price,
            thumbnail,
            code,
            stock, 
            category,
            status,
            available
        }
        products.push(product)
        await fs.promises.writeFile(this.path, JSON.stringify(products), 'utf-8')
        return product
    }
    async getProductById(id){
        const products = await this.getProducts() 
        let productById = products.find(prod => prod.id === id)
        if(!productById){
            return console.log('The product does not exist')
        }
        console.log(productById)
        return productById
    }
    async updateProduct(id, productToModify){
        const products = await this.getProducts() 
        const pos = products.findIndex(prod => prod.id === id)
        if(isNaN(pos)){
            return console.log('The product does not exist')
        }
        products[pos] = {
            id,
            ...productToModify
            
        }
        
        await fs.promises.writeFile(this.path, JSON.stringify(products))
        return products[pos]
    }
    async deleteProduct(id){ 
        const products = await this.getProducts() 
        const productToBeDeleted = products.filter(prod => prod.id !== id)
        if(productToBeDeleted){
            await fs.promises.writeFile(this.path, JSON.stringify(productToBeDeleted), 'utf-8')
        } else{
            return console.error('The product does not exist')
        }
    }
    
}

export default ProductManager







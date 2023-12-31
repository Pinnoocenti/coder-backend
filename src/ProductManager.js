import fs from 'fs'

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

/*const test= async ()=>{
    const productManager = new ProductManager('./products.json')
    await productManager.addProduct("producto prueba 1", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)
    await productManager.addProduct("producto prueba 2", "Este es un producto prueba 2", 250, "Sin imagen", "abc124", 25)
    await productManager.addProduct("producto prueba 3", "Este es un producto prueba 3", 270, "Sin imagen", "abc150", 75)
    await productManager.addProduct("producto prueba 4", "Este es un producto prueba 4", 350, "Sin imagen", "abc180", 70)
    await productManager.addProduct("producto prueba 5", "Este es un producto prueba 5", 330, "Sin imagen", "abc200", 40)
    console.log(await productManager.getProducts())
    //console.log('The searched products are:')
    //await productManager.getProductById(1)
    //await productManager.getProductById(5)

    //await productManager.updateProduct(1, 'price', 600)
    //await productManager.getProductById(1)
    //await productManager.deleteProduct(2)
    
    //console.log(await productManager.getProducts())
}*/






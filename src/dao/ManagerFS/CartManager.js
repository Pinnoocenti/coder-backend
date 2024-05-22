const fs = require('fs');

class CartManager {
    constructor(path){
        this.path = path
    }
    static id = 0

    async getCarts(){ 
        try{
            const cartsData = await fs.promises.readFile(this.path, 'utf-8')
            const parseData = JSON.parse(cartsData) 
            return parseData
        } catch (error){
            console.error('There are no carts')
            return []
        }
    }
    async addCart(){ 
        const carts = await this.getCarts()
        CartManager.id++
        const cart = {
            id: CartManager.id,
            products : []
        }
        carts.push(cart)
        await fs.promises.writeFile(this.path, JSON.stringify(carts), 'utf-8')
        return cart
    }
    async getCartById(id){
        const carts = await this.getCarts()
        let cartById = carts.find(c => c.id === id)
        if(!cartById){
            return console.log('The cart does not exist')
        }
        console.log(cartById.products)
        return cartById.products
    }
    async addProduct(cid, pid){
        const carts = await this.getCarts() 
        const pos = carts.findIndex(cart => cart.id === cid)
        if(isNaN(pos)){
            return console.log('The cart does not exist')
        }
        const cartProducts = carts[pos].products
        const searchedProduct =  cartProducts.find(prod => prod.pid === pid)
        console.log(searchedProduct)
        if(searchedProduct){
            searchedProduct.quantity++
           
        } else{
            cartProducts.push({
                pid, 
                quantity : +1
            })
        }
        
        await fs.promises.writeFile(this.path, JSON.stringify(carts))
        return cartProducts
    }
}
export default CartManager
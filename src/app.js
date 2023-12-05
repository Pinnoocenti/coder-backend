import express from 'express'
import ProductManager from './ProductManager.js'
const PORT = 8080
const app = express()

const productManager = new ProductManager('./products.json')

app.use(express.urlencoded({extended:true}))

app.get('/products', async (req, res)=>{
    const products = await productManager.getProducts()
    let {limit } = req.query
    if(!limit){
        return res.send(products)
    }
    limit = parseInt(limit)
    if(isNaN(limit)){
        return res.status(400).send('Limit debe ser un número')
    }
    const limitedProducts = products.slice(0, limit)
    res.send(limitedProducts)
})

app.get('/products/:id', async (req, res)=>{
    let {id} = req.params
    id = parseInt(id)
    if(isNaN(id)){
        return res.status(400).send('El id debe ser un número')
    }
    const product = await productManager.getProductById(id)
    res.send(product)
})

app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en puerto ${PORT}`)
})
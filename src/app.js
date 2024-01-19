import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import productsRouter from './routes/products.routes.js'
import cartsRouter from './routes/carts.routes.js'
import viewsRoutes from './routes/view.routes.js'
import ProductManagerDB from './dao/ManagerDB/productManagerDB.js'
import CartManagerDB from './dao/ManagerDB/cartManagerDB.js'


const PORT = 8080
const app = express()

const productManager = new ProductManagerDB()
const cartManager = new CartManagerDB()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

mongoose.connect('mongodb+srv://Pinno:conikpa10@cluster0.cq9w84x.mongodb.net/ecommerce')

const hbs = handlebars.create({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true 
    }
})
app.engine('handlebars', hbs.engine)
app.set('views', 'src/views')
app.set('view engine', 'handlebars')

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/', viewsRoutes)


const httpServer = app.listen(PORT, ()=>{
    console.log(`Server on ${PORT}`)
})

const socketServer = new Server(httpServer)

socketServer.on('connection', (socket)=>{
    console.log('New client connected')
})

export { socketServer }
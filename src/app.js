import express from 'express'
import productsRouter from './routes/products.routes.js'
import cartsRouter from './routes/carts.routes.js'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import viewsRoutes from './routes/view.routes.js'

const PORT = 8080
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

app.engine('handlebars', handlebars.engine())
app.set('views', 'src/views')
app.set('view engine', 'handlebars')


app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/realtimeproducts', viewsRoutes)

const httpServer = app.listen(PORT, ()=>{
    console.log(`Server on ${PORT}`)
})

const socketServer = new Server(httpServer)

socketServer.on('connection', (socket)=>{
    console.log('New client connected')
})

export { socketServer }
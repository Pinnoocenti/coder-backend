import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import productsRouter from './routes/products.routes.js'
import cartsRouter from './routes/carts.routes.js'
import viewsRoutes from './routes/view.routes.js'
import ProductManagerDB from './dao/ManagerDB/productManagerDB.js'
import CartManagerDB from './dao/ManagerDB/cartManagerDB.js'
import session from 'express-session' 
import FileStore  from 'session-file-store'
import MongoStore from 'connect-mongo'
import cookieParser from 'cookie-parser'
import sessionRoutes from './routes/session.routes.js'
import passport from 'passport'
import initializePassport from './config/passport.config.js'

const PORT = 8080
const fileStore = FileStore(session)
const app = express()

const productManager = new ProductManagerDB()
const cartManager = new CartManagerDB()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser('PilaR@737*Coder'))
app.use(express.static('public'))

app.use(session({
    secret: 'PilaR@737*Coder',
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://Pinno:conikpa10@cluster0.cq9w84x.mongodb.net/ecommerce',
        ttl: 60
    }),
    resave: true,
    saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

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
app.use('/api/session', sessionRoutes)
app.use('/', viewsRoutes)



const httpServer = app.listen(PORT, ()=>{
    console.log(`Server on ${PORT}`)
})

const socketServer = new Server(httpServer)

socketServer.on('connection', (socket)=>{
    console.log('New client connected')
})

export { socketServer }
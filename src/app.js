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
import MongoStore from 'connect-mongo'
import cookieParser from 'cookie-parser'
import sessionRoutes from './routes/session.routes.js'
import passport from 'passport'
import initializePassport from './config/passport.config.js'
import { Command } from 'commander'
import { getVariables } from './config/config.js'

const app = express()
const program = new Command()
const productManager = new ProductManagerDB()
const cartManager = new CartManagerDB()

program.option('-m --mode <mode>', 'Modo de trabajo', 'production')
const options = program.parse()
const { port,secretPassword, mongoURL} = getVariables(options)

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser('PilaR@737*Coder'))
app.use(express.static('public'))

app.use(session({
    secret: 'PilaR@737*Coder',
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://Pinno:conikpa10@cluster0.cq9w84x.mongodb.net/coder',
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

const httpServer = app.listen(8080, ()=>{
    console.log(`Server on ${8080}`)
})

const socketServer = new Server(httpServer)
socketServer.on('connection', (socket)=>{
    console.log('New client connected')
})

export { socketServer }
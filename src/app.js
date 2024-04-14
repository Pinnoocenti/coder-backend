import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import productsRouter from './routes/products.routes.js'
import cartsRouter from './routes/carts.routes.js'
import viewsRoutes from './routes/view.routes.js'
import session from 'express-session' 
import MongoStore from 'connect-mongo'
import cookieParser from 'cookie-parser'
import sessionRoutes from './routes/session.routes.js'
import passport from 'passport'
import initializePassport from './config/passport.config.js'
import { Command } from 'commander'
import { getVariables } from './config/config.js'
import { errorHandler } from './middlewares/errors.js'

const app = express()
const program = new Command()

program.option('--mode <mode>', 'Modo de trabajo', 'production')
const options = program.parse()
const { port,secretPassword, mongoURL} = getVariables(options)

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser(secretPassword))
app.use(express.static('public'))

app.use(session({
    secret: secretPassword,
    store: MongoStore.create({
        mongoUrl: mongoURL,
        ttl: 60000
    }),
    resave: true,
    saveUninitialized: true,
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

mongoose.connect(mongoURL)

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
app.use(errorHandler)

const httpServer = app.listen(port, ()=>{
    console.log(`Server on ${port}`)
})

const socketServer = new Server(httpServer)
socketServer.on('connection', (socket)=>{
    console.log('New client connected')
})

export { socketServer }
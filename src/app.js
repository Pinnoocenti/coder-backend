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
import {logger} from './utils/logger.js'
import userRoutes from './routes/users.routes.js'

const app = express()
const program = new Command()

app.use(logger)

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
app.use('/api/users', userRoutes)
app.use('/', viewsRoutes)

//enpoint para el logger test para tutor 
app.get('/loggerTest', (req,res) =>{
    req.logger.debug('Esto es un debug')
    req.logger.http('Esto es un http')
    req.logger.info('Esto es info')
    req.logger.warning('Esto es un warning')
    req.logger.error('Esto es un error')
    req.logger.fatal('Esto es un fatal')
    res.send({message: 'Logger de prueba'})
    
})
app.use(errorHandler)

const httpServer = app.listen(port, ()=>{
    console.log(`Server on ${port}`)
})

const io = new Server(httpServer)

let messages= []

io.on('connect', socket=>{
    console.log('New client connected')

    socket.emit('messageLogs', messages)
    socket.on('message', data =>{
        messages.push(data)
        io.emit('messageLogs', messages)
    })
    socket.on('newUser', user =>{
        io.emit('newConnection', 'A new user is conect')
        socket.broadcast.emit('notification', user)
    })
})

export { io }
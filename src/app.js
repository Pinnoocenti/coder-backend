import express from 'express'
import handlebars from 'express-handlebars'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import { Server } from 'socket.io'
import session from 'express-session' 
import MongoStore from 'connect-mongo'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUIExpress from 'swagger-ui-express'
import productDAO from './dao/Manager/productDAO.js'

import productsRouter from './routes/products.routes.js'
import cartsRouter from './routes/carts.routes.js'
import viewsRoutes from './routes/view.routes.js'
import sessionRoutes from './routes/session.routes.js'
import userRoutes from './routes/users.routes.js'

import passport from 'passport'
import initializePassport from './config/passport.config.js'
import { Command } from 'commander'
import { getVariables } from './config/config.js'
import { errorHandler } from './middlewares/errors.js'
import {logger} from './utils/logger.js'
import {swaggerConfiguration} from './utils/swagger.js'


const app = express()
const program = new Command()

app.use(logger)

//program.option('--mode <mode>', 'Modo de trabajo', 'production')
const options = program.parse()
const { port,secretPassword, mongoURL} = getVariables(options)

//SWAGGER
const specs = swaggerJSDoc(swaggerConfiguration)
app.use('/apidocs', swaggerUIExpress.serve, swaggerUIExpress.setup(specs))

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser(secretPassword))
app.use(express.static('public'))

//MONGO
app.use(session({
    secret: secretPassword,
    store: MongoStore.create({
        mongoUrl: mongoURL,
        ttl: 60000
    }),
    resave: true,
    saveUninitialized: true,
}))

//PASSPORT
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

mongoose.connect(mongoURL)
//HANDLEBARS
const hbs = handlebars.create({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true 
    }
})
app.engine('handlebars', hbs.engine)
app.set('views', 'src/views')
app.set('view engine', 'handlebars')

//RUTAS
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

//SOCKET IO
const io = new Server(httpServer)

let messages= []

io.on('connect', async socket=>{
    console.log('New client connected')
    //Mostrar todos los productos hasta el momento
    const products = await productDAO.getProductsHome();
    if (products.message === "OK") {
        socket.emit("updateProducts", products.products);
    }
    //Agregar producto
    socket.on('addProd', async prod => {
        console.log('Agregar un producto ')
        try {
         const productAdded = await productDAO.addProduct(prod)
         if (productAdded){
          const resultado = await productDAO.getProductsHome()
          if (resultado.message==="OK"){
            socket.emit("updateProducts",resultado.products)  
          }
         }
         return products
        } catch (error) {
          console.log("There was an error adding the product: ", error)
        }
        })
      //Eliminar producto  
      socket.on('delProd', async id => {
        const deleted=await productDAO.deleteProduct(id)
        if (deleted.message==="ok"){
          const resultado = await productDAO.getProductsHome()
          if (resultado.message==="OK"){
            socket.emit("updateProducts",resultado.products )  
          }
        }else
          console.log("There was an error deleting the product ", deleted.rdo)
      });

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
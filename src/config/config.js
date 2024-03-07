import dotenv from 'dotenv'

export const getVariables = (options) =>{
    const enviroment = options.opts().mode
    
    dotenv.config({
        path: enviroment === 'production' ? '../.env/.env.production' : '../.env/.env.development'
    })

    return{
        port: process.env.PORT,
        mongoURL: process.env.MONGO_URL,
        secretPassword: process.env.SECRET_PASSWORD
    }
}
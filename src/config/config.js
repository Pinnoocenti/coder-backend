import dotenv from 'dotenv'

export const getVariables = (options) =>{
    const enviroment = options.opts().mode
    dotenv.config({
        path: enviroment === 'production' ? './.env.production' : './.env.development'
    })

    return{
        port: process.env.PORT,
        mongoURL: process.env.MONGO_URL,
        secretPassword: process.env.SECRET_PASSWORD,
        userAdmin: process.env.USER_ADMIN,
        passAdmin: process.env.PASSADMIN
    }
}
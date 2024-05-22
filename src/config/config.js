import dotenv from 'dotenv'

export const getVariables = (options) =>{
    const enviroment = options.opts().mode
    dotenv.config({
        path: enviroment === 'production' ? './.env.production' : './.env.development'
    })

    return{
        port: process.env.PORT || 8080,
        mongoURL: process.env.MONGO_URL,
        mongo_URL_test: process.env.MONGO_URL_TEST,
        secretPassword: process.env.SECRET_PASSWORD,
        userAdmin: process.env.USER_ADMIN,
        passAdmin: process.env.PASSADMIN,
        userMailing: process.env.MAILING_USER,
        service: process.env.MAILING_SERVICE,
        passwordMailing: process.env.MAILING_PASSWORD,
    }
}
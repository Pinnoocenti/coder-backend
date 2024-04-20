import winston from "winston";

const customLevelOptions = {
    levels: { 
        fatal:0,
        error:1,
        warning:2,
        info:3,
        http:4,
        debug:5,
    },
    colors: { 
        fatal:'red',
        error:'magenta',
        warning:'yellow',
        info:'blue',
        http: 'cyan',
        debug:'white',
    },
}

const devLogger = winston.createLogger({
    levels: customLevelOptions.levels, 
    transports: [ 
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine( 
                winston.format.colorize({colors: customLevelOptions.colors}),
                winston.format.simple()
            )
        }),
    ]
})
const prodLogger = winston.createLogger({
    levels: customLevelOptions.levels, 
    transports: [ 
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine( 
                winston.format.colorize({colors: customLevelOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            level: 'error',
            filename: './errors.log',
            format: winston.format.simple()
        })
    ]
})


export const logger = (req, res, next) => {
    switch (process.env.LOGGER) {
        case 'development':
            req.logger = devLogger
            break;
        case 'production':
            req.logger = prodLogger
            break;
        default:
            throw new Error('enviroment doesnt exist ')
    }
    next()
}

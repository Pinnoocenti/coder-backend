import ErrorEnum from "../errors/error.enum.js"

export const errorHandler = (error, req, res, next)=>{
    console.log(error.cause)
    console.log(error)
    switch (error.code) {
        case ErrorEnum.NOT_FOUND:
            return res.status(404).send({error: error.name})
        case ErrorEnum.DATABASE_ERROR:
            return res.status(400).send({error: error.name})
        case ErrorEnum.INVALID_TYPE_ERROR:
            return res.status(400).send({error: error.name})
        default:
            return res.status(400).send({error: 'Unhandled error'})
    }
    next() 
}
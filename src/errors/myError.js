export default class MyError extends Error {
    constructor({name = 'Error', cause, message, code = 1}) {
        super() // super llama al mismo metodo pero del padre 
        this.name = name
        this.cause = cause
        this.message = message
        this.code = code
    }
}

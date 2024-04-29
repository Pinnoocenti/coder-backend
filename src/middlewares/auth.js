import { userModel } from "../dao/models/user.model.js"
import { isValidPassword } from "../config/bcrypt.js"

export const checkAuth = (req,res, next)=>{
    if(!req.session.user){
        return res.redirect('/login')
    }
    next()
}

export const checkExistingUser = (req,res,next)=>{
    if(req.session.user){
        return res.redirect('/products')
    }
    next()
}
//ver si es necesario o si esta de mas
export const checkLogin = async (req,res,next) =>{
    const {email, password} = req.body
    try {
        const user = await userModel.findOne({email})
        if(!user || !isValidPassword(user, password)){
            return res.redirect('/failLogin')
        }
        req.user = user
        next()
    } catch (error) {
        console.error(error)
    }
}
export const authorization = (roles)=>{
    return async (req, res, next)=>{
        if(!roles.includes(req.session?.user?.role)){
            return res.status(403).send({error: 'No permissions'})
        }
        next()
    }
}
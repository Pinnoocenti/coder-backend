import UserDTO from "../dao/dto/user.dto.js"
import userDAO from "../dao/Manager/userDAO.js"
import MailingService from "../services/mailing.js"
import jwt from 'jsonwebtoken'
import { generateResetPasswordToken } from "../services/jwt.js"
import { createHash } from "../config/bcrypt.js"

export const addRegisterController = (req, res) => {
    res.render('userCreateSuccess')
}
export const getCurrentUserController = (req,res)=>{
    const user = new UserDTO(req.user)
    res.send(user.getCurrentUser())
}
export const postLoginSessionController = (req, res) => {
    if(!req.user){
        return res.status(400).send({ message: 'Error with credentials' })
    }

    req.session.user = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        age: req.user.age,
        email: req.user.email,
        role: req.user.role,
        _id: req.user._id,
        cart: req.user.cart,
    }
    req.session.save()
    
    res.redirect('/')
}
export const postLogoutSessionController = (req, res) => {
    req.session.user = null
    console.log('llego hasta aca')
    res.redirect('/login')
}
export const sendEmailToResetPassword = async (req,res)=>{
    const email = req.body.email
    console.log(email)
    try {
        const user = await userDAO.getUserByEmail(email)
        console.log(user)
        if(!user){
            return res.redirect('/failemail')
        }
        console.log(user.user.email)
        const resetToken = generateResetPasswordToken()
        const resetLink = `http://localhost:8080/changepassword?token=${resetToken}`
        const mailingService = new MailingService()
        
        await mailingService.sendSimpleMail({
            from: 'Coder Ecommerce',
            to: user.user.email,
            subject: 'Reestablecer contraseña',
            html: `
                <h2>Hola ${user.user.firstName} !</h2>
                <h3>¿Olvidaste tu clave?</h3>
                <h3>Toca en continuar para modificarla</h3>
                <button><a href=${resetLink}>Continuar</a></button>
            `
        })
        res.send({message: 'Email sent successfully'})

    } catch (error) {
        console.log(error)
    }
}
export const changePassword = async (req,res) =>{
    const {email, password} = req.body
    try {
        const { user } = await userDAO.getUserByEmail(email)
        await userDAO.update(user._id, {password: createHash(password)})

        return res.send({message: 'Password reseted successful'})
    } catch (error) {
        throw error
    }
        
    
}
export const getGithubSessionController = (req, res) => {}

export const getGithubCBController = (req,res)=>{
    req.session.user = req.user
    res.redirect('/')
}

import UserDTO from "../dao/dto/user.dto.js"
import userDAO from "../dao/Manager/userDAO.js"
import MailingService from "../services/mailing.js"
import jwt from 'jsonwebtoken'
import { generateResetPasswordToken } from "../services/jwt.js"
import { createHash, isValidPassword } from "../config/bcrypt.js"
import { logger } from "../utils/logger.js"


export const addRegisterController = (req, res) => {
    res.render('userCreateSuccess')
}
export const getCurrentUserController = (req, res) => {
    const user = new UserDTO(req.user)
    res.send(user.getCurrentUser())
}
export const postLoginSessionController = async (req, res) => {
    if (!req.user) {
        return res.status(400).send({ message: 'Error with credentials' })
    }
    const uid = req.user._id

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
    await userDAO.update(uid, { last_connection: `login ${new Date().toISOString()}` })

    res.redirect('/')
}
export const postLogoutSessionController = async (req, res) => {
    try {
        req.session.destroy((error) => {
            if (error)
                return res.status(500).send({ message: 'No se pudo cerrar la sesion' })
        })
        await userDAO.update(uid, { last_connection: `logout ${new Date().toISOString()}` })
        return res.redirect('/login')
    }
    catch (error) {
        res.status(400).send({ error })
    }

}
export const sendEmailToResetPassword = async (req, res) => {
    const { email } = req.body
    req.logger.debug(email)
    try {
        const user = await userDAO.getUserByEmail(email)
        req.logger.debug(user)
        if (!user) {
            return res.redirect('/failemail')
        }
        req.logger.debug(user.email)
        const resetToken = generateResetPasswordToken()
        const resetLink = `http://localhost:8080/changepassword?token=${resetToken}`
        const mailingService = new MailingService()

        await mailingService.sendSimpleMail({
            from: 'Coder Ecommerce',
            to: user.email,
            subject: 'Reestablecer contraseña',
            html: `
                <h2>Hola ${user.firstName} !</h2>
                <h3>¿Olvidaste tu clave?</h3>
                <h3>Toca en continuar para modificarla</h3>
                <button><a href=${resetLink}>Continuar</a></button>
            `
        })
        res.send({ message: 'Email sent successfully' })

    } catch (error) {
        req.logger.error(error)
        res.status(500)
    }
}
export const changePassword = async (req, res) => {
    const { email, password } = req.body
    
    try {
        const hashPassword = createHash(password)
        const user = await userDAO.getUserByEmail(email)
        
        if(isValidPassword(user, password)){
            return res.status(400).send({message: 'The password has to be different '})
        }
        await userDAO.update(user._id, { password: hashPassword })

        return res.send({ message: 'Password reseted successful' })
    } catch (error) {
        throw error
    }


}
export const getGithubSessionController = (req, res) => { }

export const getGithubCBController = (req, res) => {
    req.session.user = req.user
    res.redirect('/')
}

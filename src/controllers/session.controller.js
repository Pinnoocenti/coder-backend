import passport from "passport";
import session from "express-session";
import UserDTO from "../dao/dto/user.dto.js";


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
        role: req.user.role
    }
    req.session.save()
    
    res.redirect('/')
}
export const postLogoutSessionController = (req, res) => {
    req.session.user = null
    res.redirect('/login')
}
export const getGithubSessionController = (req, res) => {}

export const getGithubCBController = (req,res)=>{
    req.session.user = req.user
    res.redirect('/')
}

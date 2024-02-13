import { Router } from "express";
import { userModel } from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../config/bcrypt.js";
import passport from "passport";


const sessionRoutes = Router()

sessionRoutes.post('/register',
    passport.authenticate('register', { failureRedirect: '/failRegister' }),
    (req, res) => {
        res.render('userCreateSuccess')
    }
)
sessionRoutes.post('/login',
    passport.authenticate('login', {failureRedirect: '/failLogin'}),
    (req, res) => {
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
        res.redirect('/')
    }
)

sessionRoutes.post('/logout', async (req, res) => {
    req.session.user = null
    res.redirect('/login')
})
sessionRoutes.get(
    '/github', 
    passport.authenticate('github', { scope: ['user:email'] }),
    (req, res) => {}
)
sessionRoutes.get(
    '/githubcallback',
    passport.authenticate('github', {failureRedirect: '/login'}),
    (req,res)=>{
        req.session.user = req.user
        res.redirect('/')
    }
)
export default sessionRoutes
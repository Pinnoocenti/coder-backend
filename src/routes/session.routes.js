import { Router } from "express";
import { userModel } from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import passport from "passport";


const sessionRoutes = Router()

sessionRoutes.post('/register',
    passport.authenticate('register', { failureRedirect: '/failregister' }),
    async (req, res) => {
        res.status(201).send({ message: 'User register' })
    }
)
sessionRoutes.post('/login',
    passport.authenticate('login', {failureRedirect: '/faillogin'}),
    async (req, res) => {
        if(!req.user){
            return res.status(400).send({ message: 'Error with credentials' })
        }

        req.session.user = {
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            age: req.user.age,
            email: req.user.email
        }
        res.redirect('/')
    }
)

sessionRoutes.post('/logout', async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: 'logout failed' })
            }

        })
        res.send({ redirect: 'http://localhost:8080/login' })
    } catch (error) {
        res.status(400).send({ error })
    }
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
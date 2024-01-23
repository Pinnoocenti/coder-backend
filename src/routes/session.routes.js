import { Router } from "express";
import { userModel } from "../dao/models/user.model.js";


const sessionRoutes = Router()

sessionRoutes.post('/register', async (req,res)=>{
    const {firstName, lastName, email, age, password} = req.body
    let role = 'user'
    if(email === 'adminCoder@coder.com' && password === 'adminCod3r123'){
        role = 'admin'
    }
    try {
        const user = await userModel.create({
            firstName, lastName, age, email, password, role
        })
        //req.session.user = user
        
        return res.redirect('/login')
        
    } catch (error) {
        console.error(error)
        res.status(400).send({error})
    }
})

sessionRoutes.post('/login', async (req,res)=>{
    const {email, password} = req.body
    try {
        const user = await userModel.findOne({email})
        if(!user){
            console.log('User not found')
            return res.redirect('/login')
        }
        if(user.password !== password){
            console.log('Password invalid')
            return res.redirect('/login')
            //return res.status(401).send({message: 'Password invalid'})
        }
        req.session.user = user
        return res.redirect('/products')
    } catch (error) {
        res.status(400).send({error})
    }
})

sessionRoutes.post('/logout', async (req,res)=>{
    try {
        req.session.destroy((err)=>{
            if(err){
                return res.status(500).json({message: 'logout failed'})
            }
            
        })
        res.send({redirect: 'http://localhost:8080/login'})
    } catch (error) {
        res.status(400).send({error})
    }
})
export default sessionRoutes
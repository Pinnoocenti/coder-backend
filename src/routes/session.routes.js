import { Router } from "express";
import passport from "passport";
import { addRegisterController, getCurrentUserController, getGithubCBController, getGithubSessionController, postLoginSessionController, postLogoutSessionController } from "../controllers/session.controller.js";

const sessionRoutes = Router()

sessionRoutes.post('/register',passport.authenticate('register', { failureRedirect: '/failRegister' }),addRegisterController)
sessionRoutes.post('/login',passport.authenticate('login', {failureRedirect: '/failLogin'}), postLoginSessionController)
sessionRoutes.post('/resetpassword')
sessionRoutes.post('/logout',postLogoutSessionController)
sessionRoutes.get('/github',passport.authenticate('github', { scope: ['user:email'] }), getGithubSessionController)
sessionRoutes.get('/githubcallback',passport.authenticate('github', {failureRedirect: '/login'}), getGithubCBController)
sessionRoutes.get('/current', getCurrentUserController)

export default sessionRoutes
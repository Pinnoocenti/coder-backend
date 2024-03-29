import passport from 'passport'
import {Strategy as LocalStrategy} from 'passport-local'
import { userModel } from '../dao/models/user.model.js'
import { createHash, isValidPassword } from './bcrypt.js'
import { Strategy as GithubStrategy } from "passport-github2"
import { Command } from 'commander'
import { getVariables } from './config.js'

const program = new Command()

program.option('--mode <mode>', 'Modo de trabajo', 'production')
const options = program.parse()
const { userAdmin, passAdmin} = getVariables(options)

const initializePassport = () => { 
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const { firstName, lastName, email, age} = req.body
            try {
                const user = await userModel.findOne({email: username})
                if(user){
                    console.log('User already exist')
                    return done(null, false)
                }
                const newUser = {
                    firstName,
                    lastName,
                    email,
                    age,
                    password: createHash(password)
                }
                const result = await userModel.create(newUser)
                return done(null, result)
            } catch (error) {
                return done('Error getting user' + error)
            }
        }
    ))
    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (username, password, done) => {
            try {
                let user

                if(username===userAdmin){
                    if(password===passAdmin){
                        user = {firstName:'Coder', lastName: 'Admin', email:username, password: createHash}
                    }else{
                        return done(null, false)
                    }
                }
                user = await userModel.findOne({ email: username })
                if (!user || !isValidPassword(user, password)) {
                    return done(null, false)
                }
                return done(null, user)
            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.use('github', new GithubStrategy(
        {
            clientID: 'Iv1.146ccf33342c5ecd',
            callbackURL: 'http://localhost:8080/api/session/githubcallback',
            clientSecret: '03820cd4e8020bb5a58e0eb7eb5ebadd3ee47394'
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log({ profile })
                const user = await userModel.findOne({ email: profile._json.email })
                if (!user) {
                    const newUser = {
                        firstName: profile._json.name.split(' ')[0],
                        lastName: profile._json.name.split(' ')[1],
                        age: 21, // pongo una edad aleatoria ya que no viene de github
                        email: profile.username,
                        password: 'githubGenerated'
                    }
                    const result = await userModel.create(newUser)
                    return done(null, result)
                }
                return done(null, user)
            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findOne({ _id: id })
        done(null, user)
    })
}

export default initializePassport
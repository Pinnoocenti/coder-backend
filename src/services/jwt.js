import jwt from 'jsonwebtoken'
import { getVariables } from '../config/config.js'
import { Command } from 'commander'

const program = new Command()
const options = program.parse()

const { secretPassword} = getVariables(options)

export const generateResetPasswordToken = () => {
    const expirationTime = Math.floor(Date.now() / 1000) + 3600
    return jwt.sign({exp: expirationTime }, secretPassword);
}

import mailer from 'nodemailer'
import { Command } from 'commander'
import { getVariables } from '../config/config.js'

const program = new Command()
const options = program.parse()


const { userMailing, service, passwordMailing} = getVariables(options)
console.log({userMailing})
console.log({passwordMailing})

export default class MailingService {
    constructor(){
        this.client = mailer.createTransport({
            service: service,
            port: 587,
            auth: {
                user: userMailing,
                pass: passwordMailing,
            },
        })
    }

    sendSimpleMail = async ({from, to, subject, html, attachments = []}) => {
        const result = await this.client.sendMail({from, to, subject, html, attachments});
        return result;
    }
    
}


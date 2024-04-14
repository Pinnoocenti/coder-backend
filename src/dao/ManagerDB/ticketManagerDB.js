import { ticketModel } from "../models/ticket.model.js";


class TicketManagerDB{
    async createTicket (amount, mail){
        try {
            const ticket = {}
            ticket.code = new Date() + Math.floor(Math.random() * 10000)
            ticket.purchaseDateTime = new Date() 
            ticket.amount = amount
            ticket.purchaser = mail
            const result = await ticketModel.create(ticket)
            return { message: 'The ticket was added', result}
        } catch (error) {
            return { message: "error", rdo: "There was an error creating tickt - " + error.message }
        }
    }
}

export default TicketManagerDB

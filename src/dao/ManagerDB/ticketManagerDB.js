import { ticketModel } from "../models/ticket.model.js";
import { v4 as uuidv4 } from 'uuid';

class TicketManagerDB{
    async createTicket (amount, email){
        try {
            const ticket = {}
            ticket.purchaseDateTime = new Date() 
            ticket.code = uuidv4()
            ticket.amount = amount
            ticket.purchaser = email
            const result = await ticketModel.create(ticket)
            return { message: 'The ticket was added', result}
        } catch (error) {
            return { message: "error", rdo: "There was an error creating tickt - " + error.message }
        }
    }
}

export default TicketManagerDB

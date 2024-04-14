import fs from 'fs'

class TicketManagerFS {
    async getTickets (){
        try{
            const ticketsData = await fs.promises.readFile(this.path, 'utf-8')
            const parseData = JSON.parse(ticketsData) 
            return parseData
        } catch (error){
            console.error('There are no tickets')
            return []
        }
    }
    async createTicket (amount, mail){
        try {
            if(!amount || !mail){
                return console.log('Incomplete ticket')
            }
            const tickets = await this.getTickets()
            const ticket = {}
            ticket.code = new Date() + Math.floor(Math.random() * 10000)
            ticket.purchaseDateTime = new Date() 
            ticket.amount = amount
            ticket.purchaser = mail

            tickets.push(ticket)
            await fs.promises.writeFile(this.path, JSON.stringify(tickets), 'utf-8')
            return { message: 'The ticket was added', ticket}
        } catch (error) {
            return { message: "error", rdo: "There was an error creating ticket - " + error.message }
        }
    }
}

export default TicketManagerFS
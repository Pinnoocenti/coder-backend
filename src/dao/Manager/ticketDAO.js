import TicketManagerDB from "../ManagerDB/ticketManagerDB.js";
import TicketManagerFS from "../ManagerFS/ticketManagerFS.js";

let ticketDAO 

const DAO_OPTION = process.env.DAO_OPTION

switch (DAO_OPTION) {
    case 'mongoose':
        ticketDAO = new TicketManagerDB()
        break;
    case 'fs':
        ticketDAO = new TicketManagerFS()
        break;

    default:
        ticketDAO = new TicketManagerDB()
        break;
}
export default ticketDAO
import CartManagerDB from "../ManagerDB/cartManagerDB.js";
import CartManager from "../ManagerFS/cartManager.js";

let cartDAO 

const DAO_OPTION = process.env.DAO_OPTION

switch (DAO_OPTION) {
    case 'mongoose':
        cartDAO = new CartManagerDB()
        break;
    case 'fs':
        cartDAO = new CartManager()
        break;

    default:
        cartDAO = new CartManagerDB()
        break;
}
export default cartDAO


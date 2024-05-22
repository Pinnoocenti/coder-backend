//import ProductManager from "../ManagerFS/ProductManager.js";
import ProductManagerDB from "../ManagerDB/productManagerDB.js";

let productDAO 

const DAO_OPTION = process.env.DAO_OPTION

switch (DAO_OPTION) {
    case 'mongoose':
        productDAO = new ProductManagerDB()
        break;
    case 'fs':
        //productDAO = new ProductManager()
        break;

    default:
        productDAO = new ProductManagerDB()
        break;
}
export default productDAO
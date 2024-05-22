import UserManagerDB from "../ManagerDB/userManagerDB.js";

let userDAO 

const DAO_OPTION = process.env.DAO_OPTION

switch (DAO_OPTION) {
    case 'mongoose':
        userDAO = new UserManagerDB()
        break;
    case 'fs':
        //userDAO = new UserManagerFS()
        break;

    default:
        userDAO = new UserManagerDB()
        break;
}
export default userDAO
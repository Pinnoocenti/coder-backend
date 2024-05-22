import userDAO from "../dao/Manager/userDAO.js"
import UserDTO from "../dao/dto/user.dto.js"
import MailingService from "../services/mailing.js"
import { logger } from "../utils/logger.js"

export const changeRole = async (req, res) => {
    try {
        const { uid } = req.params
        const user = await userDAO.getUserById(uid)
        req.logger.debug(user)

        if (user.role === 'user') {
            const identification = user.documents.find(d => d.name === 'identification')
            const address = user.documents.find(d => d.name === 'address')
            const accountStatus = user.documents.find(d => d.name === 'accountStatus')

            if (!identification || !address || !accountStatus) {
                return res.status(400).send({ message: 'Error - some document is missing' })
            }
            const userUpdate = await userDAO.update(uid, { role: 'premium' })
            return res.send(userUpdate)
        }
        if (user.role === 'premium') {
            const userUpdate = await userDAO.update(uid, { role: 'user' })
            return res.send(userUpdate)
        }
    } catch (error) {
        req.logger.error(error)
        return res.status(500).json({ message: 'error' })
    }
}
export const getUserByEmail = async (req, res) => {
    try {
        const { uEmail } = req.params
        const user = await userDAO.getUserByEmail(uEmail)

        return res.send(user)
    } catch (error) {
        req.logger.error(error)
        return res.status(500).json({ message: 'error' })
    }
}
export const uploadDocument = async (req, res) => {
    if (!req.files) {
        return res.status(400).send({ message: 'Error - the document could not be saved' })
    }
    const { user } = req.session
    try {
        const searchedUser = await userDAO.getUserById(user._id)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        let documents = [...searchedUser.documents]
        const files = req.files
        pushDocument(files['identification'], documents)
        
        pushDocument(files['address'], documents)
        
        pushDocument(files['accountStatus'], documents)
        await userDAO.update(user._id, { documents: documents })
        return res.status(200).json({ message: 'Documents uploaded successfully' })
    } catch (error) {
        console.log(error)
    }
}
export const pushDocument = (file, documents) => {
    if (!file) {
        return;
    }
    const i = documents.findIndex(d => d.name === file[0].fieldname)
    
    if (i > -1) { documents.splice(i, 1) }
    const newfile = {
        name: file[0].fieldname,
        reference: file[0].path
    }
    documents.push(newfile)
}
export const getUsers = async (req, res) => {
    try {
        const users = await userDAO.getUsers()
        const usersDTOs = users.map(user => new UserDTO(user).getCurrentUser())
        return res.send(usersDTOs)
    } catch (error) {
        req.logger.error(error)
        return res.status(500).json({ message: 'error' })
    }
}
export const deleteInactiveUsers = async (req,res)=>{
    try {
        const users = await userDAO.getUsers()
        const today = new Date()
        const twoDaysAgo = new Date(today)
        twoDaysAgo.setDate(today.getDate() - 2)
        const inactiveUsers = users.filter( user => {
            const lastConnection = user.last_connection
            if(!lastConnection){
                return false
            }
            const userLastConnection = lastConnection.split(' ')[1]
            console.log(userLastConnection)
            console.log(twoDaysAgo)
            return userLastConnection < twoDaysAgo.toISOString()
        })
        req.logger.info(inactiveUsers)
        const mailingService = new MailingService()

        for(const user of inactiveUsers){
            await mailingService.sendSimpleMail({
                from: 'Coder Ecommerce',
                to: user.email,
                subject: 'Usuario eliminado',
                html: `
                    <h2>Hola ${user.firstName} !</h2>
                    <h2>Le informamos que su usuario ha sido eliminado por inactividad</h2>     
                `
            })
            await userDAO.deleteUser(user.email)
        }
        
        return res.status(200).json({message: 'inactive users successfully deleted'})

    } catch (error) {
        req.logger.error(error)
        return res.status(500).json({ message: 'error' })
    }
}
export const deleteUser = async (req,res)=>{
    try {
        const {uemail} = req.params
        await userDAO.deleteUser(uemail)

        return res.status(200).json({message: 'user deleted'})
    } catch (error) {
        req.logger.error(error)
        return res.status(500).json({ message: 'error - The user could not delete' })
    }
    
}
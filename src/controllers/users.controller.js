import userDAO from "../dao/Manager/userDAO.js"

export const changeRole = async (req,res)=>{
    try {
        const {uid} =req.params
        const user = await userDAO.getUserById(uid)
        
        if(user.role === 'user'){
            const userUpdate = await userDAO.update(uid, {role: 'premium'})
            return res.send(userUpdate)
        } 
        if(user.role === 'premium'){
            const userUpdate = await userDAO.update(uid, {role: 'user'})
            return res.send(userUpdate)
        }         
    } catch (error) {
        return res.status(500).json({message: 'error'})
    }
}
export const getUserByEmail = async (req,res)=>{
    try {
        const {uEmail} =req.params
        const user = await userDAO.getUserByEmail(uEmail)

        return res.send(user) 
    } catch (error) {
        return res.status(500).json({message: 'error'})
    }
}

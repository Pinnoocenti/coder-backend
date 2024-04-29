import userDAO from "../dao/Manager/userDAO.js"

export const changeRole = async (req,res)=>{
    try {
        const {uid} =req.params
        const user = await userDAO.getUserById(uid)
        if(user.rdo.role === 'user'){
            const userUpdate = await userDAO.update(uid, {role: 'premium'})
            return res.send({message: 'OK'})
        } 
        if(user.rdo.role === 'premium'){
            const userUpdate = await userDAO.update(uid, {role: 'user'})
            return res.send({message: 'OK'})
        }         
    } catch (error) {
        return res.status(500).json({message: 'error'})
    }
}
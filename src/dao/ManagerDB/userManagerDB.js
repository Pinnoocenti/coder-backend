import { userModel } from "../models/user.model.js";

class UserManagerDB{
    async createUser (newUser){
        try {
            if(!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.email || !newUser.age || !newUser.password || !newUser.role){
                return { message: 'error - Incomplete user' }
            }
            const userCreated = await userModel.create(newUser)

            if(!userCreated){
                return { message: 'error creating user' }
            }
            return {userCreated, message: 'The user was created'}
        } catch (error) {
            return { message: "There was a problem creating user", error }
        }
    }
    async getUserByEmail (uemail) {
        try {
            
            const user = await userModel.findOne(uemail).populate('cart')
            
            if (user) {
                return { message: "ok", user }
            } else {
                return { message: "error - The user does not exist"}
            }
        } catch (error) {
            return { message: "error", rdo: " There was an error when obtaining the user" + error.message }
        }
    }
    async getUserById (uid) {
        try {
            const user = await userModel.findOne({ _id: uid })
            if (user) {
                return { message: "ok", rdo: user }
            } else {
                return { message: "error - The user does not exist"}
            }
        } catch (error) {
            return { message: "error", rdo: " There was an error when obtaining the user" + error.message }
        }
    }
    async update (pid, toModify){
        try {
            console.log('userUpdate ' + pid + toModify)
            const updateUser = await userModel.updateOne({ _id: pid }, toModify)
            if(update.modifiedCount>0) {
                return updateUser
            }
            return { message: 'there was an error updating the user'}
        } catch (error) {
            return { message: 'error'}
        }
    }
}

export default UserManagerDB

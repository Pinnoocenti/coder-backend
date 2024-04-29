import ErrorEnum from "../../errors/error.enum.js";
import { databaseError } from "../../errors/info.js";
import MyError from "../../errors/myError.js";
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

            const user = await userModel.findOne({email: uemail}).populate('cart')
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
    async update (uid, toModify){
        try {
            console.log('userUpdate ' + uid )
            const updateUser = await userModel.updateOne({ _id: uid }, toModify)
            if(updateUser.modifiedCount>0) {
                return updateUser
            }
            throw new MyError({
                name: 'The password was not updated', 
                cause: databaseError(),
                message: 'Error ',
                code: ErrorEnum.DATABASE_ERROR,
            })
        } catch (error) {
            throw error
        }
    }
    
}

export default UserManagerDB

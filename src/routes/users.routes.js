import { Router } from "express";
import { changeRole, deleteInactiveUsers, deleteUser, getUserByEmail, getUsers, uploadDocument } from "../controllers/users.controller.js";
import { uploader } from "../utils/multer.js";
import { authorization } from "../middlewares/auth.js";

const userRoutes = Router()

userRoutes.put('/premium/:uid', authorization(['admin']), changeRole)
userRoutes.get('/', authorization(['admin']), getUsers)
userRoutes.delete('/', authorization(['admin']), deleteInactiveUsers)
userRoutes.delete('/:uemail', authorization(['admin']),deleteUser)
userRoutes.get('/:uemail', getUserByEmail)
userRoutes.post('/:uid/documents',uploader.fields([
    { name: 'identification', maxCount: 1 },
    { name: 'address', maxCount: 1 },
    { name: 'accountStatus', maxCount: 1 }
  ]), uploadDocument)

export default userRoutes
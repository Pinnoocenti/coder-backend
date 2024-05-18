import { Router } from "express";
import { changeRole, getUserByEmail, uploadDocument } from "../controllers/users.controller.js";
import { uploader } from "../utils/multer.js";

const userRoutes = Router()

userRoutes.put('/premium/:uid', changeRole)
userRoutes.get('/:uemail', getUserByEmail)
userRoutes.post('/:uid/documents',uploader.fields([
    { name: 'identification', maxCount: 1 },
    { name: 'address', maxCount: 1 },
    { name: 'accountStatus', maxCount: 1 }
  ]), uploadDocument)

export default userRoutes
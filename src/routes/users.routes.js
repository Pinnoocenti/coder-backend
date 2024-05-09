import { Router } from "express";
import { changeRole, getUserByEmail } from "../controllers/users.controller.js";

const userRoutes = Router()

userRoutes.put('/premium/:uid', changeRole)
userRoutes.get('/:uemail', getUserByEmail)

export default userRoutes
import { Router } from "express";
import { changeRole } from "../controllers/users.controller.js";

const userRoutes = Router()

userRoutes.put('/premium/:uid', changeRole)

export default userRoutes
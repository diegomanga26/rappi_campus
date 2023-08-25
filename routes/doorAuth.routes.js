import { Router } from "express";
import { registerDto,loginDto } from "../storage/door.dto.js";
import { registerUsuario,loginUsuario } from "../versions/users_version/user_actions.js";

export const register = Router();
export const login = Router();

register.post('/', registerDto,registerUsuario)
login.post('/', loginDto,loginUsuario)
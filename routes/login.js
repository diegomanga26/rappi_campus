import { Router } from "express";
import { registerDto, loginDto } from "../storage/door.dto.js";
import routesVersioning from "express-routes-versioning";
import {
  registerUsuario,
  loginUsuario,
} from "../versions/users_version/user_actions.js";

const version = routesVersioning();

export const login = Router();

login.post(
  "/",
  loginDto,
  version({
    "3.0.0": loginUsuario,
  })
);

export default login;

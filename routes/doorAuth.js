// Importamos el módulo "express" y las funciones y DTOs necesarios
import { Router } from "express";
import { registerDto, loginDto } from "../storage/door.dto.js";
import routesVersioning from "express-routes-versioning";
import {
  registerUsuario,
  loginUsuario,
} from "../versions/users_version/user_actions.js";
import { limitGrt } from "../middlewares/limiter.js";

const version = routesVersioning();


const auth = Router();
auth.use(limitGrt());


auth.post(
  "/register",
  registerDto,
  version({
    "3.0.0": registerUsuario,
    fallbackVersion: "2.0.0",
  })
);


auth.post(
  "/login",
  loginDto,
  version({
    "3.0.0": loginUsuario,
    fallbackVersion: "2.0.0",
  })
);

export default auth;

// Importamos el módulo "express" y las funciones y DTOs necesarios
import { Router } from "express";
import { registerDto, loginDto } from "../storage/door.dto.js";
import routesVersioning from "express-routes-versioning";
import {
  registerUsuario,
  loginUsuario,
} from "../versions/users_version/user_actions.js";

const version = routesVersioning();

// Creamos una instancia de enrutador para el registro de usuarios
const auth = Router();

// Creamos una instancia de enrutador para el inicio de sesión de usuarios
// export const login = Router();

// Definimos una ruta POST para el registro de usuarios
// Aquí utilizamos el DTO (Data Transfer Object) "registerDto" para validar los datos antes de ejecutar la acción
auth.post(
  "/register",
  registerDto,
  version({
    "3.0.0": registerUsuario,
  })
);

// Definimos una ruta POST para el inicio de sesión de usuarios
// Aquí utilizamos el DTO "loginDto" para validar los datos antes de ejecutar la acción
auth.post(
  "/login",
  loginDto,
  version({
    "3.0.0": loginUsuario,
  })
);

export default auth;
// Importamos el módulo "express" y las funciones y DTOs necesarios
import { Router } from "express";
import { registerDto, loginDto } from "../storage/door.dto.js";
import { registerUsuario, loginUsuario } from "../versions/users_version/user_actions.js";

// Creamos una instancia de enrutador para el registro de usuarios
export const register = Router();

// Creamos una instancia de enrutador para el inicio de sesión de usuarios
export const login = Router();

// Definimos una ruta POST para el registro de usuarios
// Aquí utilizamos el DTO (Data Transfer Object) "registerDto" para validar los datos antes de ejecutar la acción
register.post('/', registerDto, registerUsuario);

// Definimos una ruta POST para el inicio de sesión de usuarios
// Aquí utilizamos el DTO "loginDto" para validar los datos antes de ejecutar la acción
login.post('/', loginDto, loginUsuario);
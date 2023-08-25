import { check } from "express-validator";

// Definición de validaciones DTO para el inicio de sesión
export const logInDto = [
    check("email").notEmpty().isString().withMessage("Email is required"), // Validación de no vacío y tipo de cadena
    check("password").notEmpty().isString().withMessage("Password is required") // Validación de no vacío y tipo de cadena
]

// Definición de validaciones DTO para el registro de usuario
export const registerDto = [
    check("name").notEmpty().isString().withMessage("Name is required"), // Validación de no vacío y tipo de cadena
    check("email").notEmpty().isString().isEmail().withMessage("Email is required"), // Validación de no vacío, tipo de cadena y formato de email
    check("password").notEmpty().isString().withMessage("Password is required"), // Validación de no vacío y tipo de cadena
    check("numCelular").notEmpty().isString().withMessage("numCelular is required"), // Validación de no vacío y tipo de cadena
    check("address").notEmpty().isString().withMessage("Address is required"), // Validación de no vacío y tipo de cadena
    check("user_type").notEmpty().isString().withMessage("Tipo usuario is required") // Validación de no vacío y tipo de cadena
]

// Definición de validaciones DTO para el inicio de sesión
export const loginDto = [
    check("email").notEmpty().isString().withMessage("Email is required"), // Validación de no vacío y tipo de cadena
    check("password").notEmpty().isString().withMessage("Password is required") // Validación de no vacío y tipo de cadena
]

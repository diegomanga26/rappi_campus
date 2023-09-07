import { check } from "express-validator";

// Definición de validaciones DTO para el registro de usuario
export const registerDto = [
    check("name").notEmpty().isString().withMessage("name is required"),
    check("address").notEmpty().isString().withMessage("address is required"),
    check("numCelular").notEmpty().isString().withMessage("numCelular is required"),
    check("email").notEmpty().isString().withMessage("email is required"),
    check("password").notEmpty().isString().withMessage("password is required"),
    check("user_type").notEmpty().isString().withMessage("user_type is required"),
    (req, res, next) => {
        if (req.body.user_type === 'repartidor') {
            check("vehiculo").notEmpty().isObject().withMessage("vehiculo is required").run(req);
        }
        next();
    }
];

// Definición de validaciones DTO para el inicio de sesión
export const loginDto = [
    check("email").notEmpty().isString().withMessage("email is required"), // Validación de no vacío y tipo de cadena
    check("password").notEmpty().isString().withMessage("password is required") // Validación de no vacío y tipo de cadena
]

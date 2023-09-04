import { check } from "express-validator";

// Definición de validaciones DTO para el registro de usuario
export const registerDto = [
    check("name").notEmpty().isString().withMessage("Name is required"),
    check("email").notEmpty().isString().isEmail().withMessage("Email is required"),
    check("password").notEmpty().isString().withMessage("Password is required"),
    check("numCelular").notEmpty().isString().withMessage("numCelular is required"),
    check("address").notEmpty().isString().withMessage("Address is required"),
    check("user_type").notEmpty().isString().withMessage("Tipo usuario is required"),
    (req, res, next) => {
        if (req.body.user_type === 'repartidor') {
            check("vehiculo").notEmpty().isObject().withMessage("Vehiculo is required").run(req);
        }
        next();
    }
];

// Definición de validaciones DTO para el inicio de sesión
export const loginDto = [
    check("email").notEmpty().isString().withMessage("Email is required"), // Validación de no vacío y tipo de cadena
    check("password").notEmpty().isString().withMessage("Password is required") // Validación de no vacío y tipo de cadena
]

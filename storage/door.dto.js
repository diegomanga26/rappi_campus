import { check } from "express-validator";

export const logInDto = [
    check("email").notEmpty().isString().withMessage("Email is required"),
    check("password").notEmpty().isString().withMessage("Password is required")
]

export const registerDto = [
    check("name").notEmpty().isString().withMessage("Name is required"),
    check("email").notEmpty().isString().isEmail().withMessage("Email is required"),
    check("password").notEmpty().isString().withMessage("Password is required"),
    check("numCelular").notEmpty().isString().withMessage("numCelular is required")
]
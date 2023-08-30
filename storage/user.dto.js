import { check } from "express-validator";


export const updateUserDto = [
    check("name").isString().optional(), 
    check("email").isString().isEmail().optional(),
    check("password").isString().optional(),
    check("numCelular").isString().optional(),
    check("address").isString().optional(), 
    check("user_type").isString().optional() 
]
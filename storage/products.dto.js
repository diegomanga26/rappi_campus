import { check } from "express-validator";

// Definición de validaciones DTO para productos
export const productsDto = [
  check("name").notEmpty().isString().withMessage("name is required"), // Validación de no vacío y tipo de cadena
  check("description").notEmpty().isString().withMessage("name is required"), // Validación de no vacío y tipo de cadena
  check("price").notEmpty().isDecimal().withMessage("price is required"), // Validación de no vacío y tipo decimal
  check("category").notEmpty().isString().withMessage("category is required"), // Validación de no vacío y tipo de cadena
  check("availability")
    .notEmpty()
    .custom((value) => {
      if (typeof value !== "boolean") {
        throw new Error("availability is required");
      }
      return true;
    }), // Validación de no vacío y tipo booleano personalizado
];

export const productsDtoUpdate = [
  check("name").isString().optional(), 
  check("description").notEmpty().isString().optional(), 
  check("price").notEmpty().isDecimal().optional(), 
  check("category").notEmpty().isString().optional(), 

];


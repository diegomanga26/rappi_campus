import { validationResult } from "express-validator";
import { con } from "../../config/atlas.js";

export async function getAllProducts(req, res) {
  if (!req.rateLimit) return; // Si no se excede el límite de tasa, se retorna
  
  const errors = validationResult(req); // Valida los errores de la solicitud
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() }); // Si hay errores, responde con 400
  
  try {
    const db = await con(); // Conexión a la base de datos
    const result = await db.collection("productos").find().toArray(); // Realiza una consulta para obtener todos los documentos de la colección "productos" y los convierte en un arreglo
    res.status(200).json(result); // Responde con éxito y el arreglo de resultados
  } catch (error) {
    console.log(error, "error"); // Registra el error en la consola
    res.status(500).send("error"); // Responde con error del servidor
  }
}

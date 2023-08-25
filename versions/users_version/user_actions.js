import { validationResult } from "express-validator";
import { con } from "../../config/atlas.js";

// Función asincrónica para obtener el siguiente ID de una colección
async function siguienteId(coleccion) {
  const db = await con();
  const sequenceDocument = await db.collection("counters").findOneAndUpdate(
    { id: `${coleccion}Id` },
    { $inc: { sequence_value: 1 } },
    { returnDocument: "after" }
  );
  return await sequenceDocument.value.sequence_value;
}

// Función para registrar un usuario
export async function registerUsuario(req, res) {
  if (!req.rateLimit) return; // Si no se excede el límite de tasa, se retorna
  const errors = validationResult(req); // Valida los errores de la solicitud
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() }); // Si hay errores, se responde con 400
  const { name: Name, email: Mail, password: Password, numCelular: CellPhone, address: Address, user_type: tipo_usuario } = req.body; // Desestructura los datos de la solicitud
  const id = await siguienteId("usuario"); // Obtiene el siguiente ID
  const json = { nombre: Name, correo: Mail, contrasena: Password, telefono: CellPhone, direccion: Address, tipo_usuario, id }; // Crea un objeto JSON con los datos
  
  try {
    const db = await con(); // Conexión a la base de datos
    await db.collection("usuario").insertOne(json); // Inserta el usuario en la colección "usuario"
    res.status(201).send("success"); // Responde con éxito
  } catch (error) {
    console.log(error, "error"); // Registra el error en la consola
    res.status(500).send("error"); // Responde con error del servidor
  }
}

// Función para iniciar sesión de un usuario
export async function loginUsuario(req, res) {
  if (!req.rateLimit) return; // Si no se excede el límite de tasa, se retorna
  const errors = validationResult(req); // Valida los errores de la solicitud
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() }); // Si hay errores, se responde con 400
  const { email: Mail, password: Password } = req.body; // Desestructura los datos de la solicitud
  try {
    const db = await con(); // Conexión a la base de datos
    const user = await db.collection("usuario").findOne({ correo: Mail, contrasena: Password }); // Busca el usuario en la colección
    if (user) {
      res.status(200).json({ message: "success", user }); // Si se encuentra el usuario, responde con éxito y el usuario
    } else {
      res.status(404).json({ message: "user not found" }); // Si no se encuentra el usuario, responde con 404
    }
  } catch (error) {
    console.log(error, "error"); // Registra el error en la consola
    res.status(500).send("error"); // Responde con error del servidor
  }
}

// Importamos el módulo "express-validator" para la validación de datos
import { validationResult } from "express-validator";
// Importamos funciones necesarias de otros archivos
import { siguienteId } from "../users_version/user_actions.js";
import { con } from "../../config/atlas.js";

// Función para transformar las claves de un objeto
function transformObject(inputObject) {
  const keyMapping = {
    'name': 'nombre_producto',
    'description': 'descripcion',
    'price': 'precio',
    'category': 'categoria',
    'availability': 'disponibilidad',
  };

  const transformedObject = {};

  for (const key in inputObject) {
    if (inputObject.hasOwnProperty(key)) {
      transformedObject[keyMapping[key] || key] = inputObject[key];
    }
  }

  return transformedObject;
}

// Función para obtener todos los productos
export async function getAllProducts(req, res) {
  if (!req.rateLimit) return; // Si no se excede el límite de tasa, no se procede

  const errors = validationResult(req); // Validar errores en la solicitud
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() }); // Si hay errores, responder con 400
  try {
    const db = await con(); // Conexión a la base de datos
    const result = await db.collection("productos").find().toArray(); // Consultar todos los documentos de la colección "productos" y convertirlos en un arreglo
    res.status(200).json(result); // Responder con éxito y el arreglo de resultados
  } catch (error) {
    console.log(error, "error"); // Registrar el error en la consola
    res.status(500).send("error"); // Responder con error del servidor
  }
}

// Función para crear un producto
export async function createProduct(req, res) {
  if (!req.rateLimit) return; // Si no se excede el límite de tasa, no se procede
  const errors = validationResult(req); // Validar errores en la solicitud
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() }); // Si hay errores, responder con 400

  // Extraer datos de la solicitud
  const { name: Name, description: DesCription, price: Price, category: Categori, availability: Avail, user_type: tipo_usuario } = req.body;
  const id = await siguienteId("producto"); // Generar un nuevo ID
  const json = { id, nombre_producto: Name, descripcion: DesCription, precio: Price, categoria: Categori, disponibilidad: Avail };
  console.log(json); // Mostrar el objeto JSON en la consola
  try {
    const db = await con(); // Conexión a la base de datos
    const result = await db.collection("productos").insertOne(json); // Insertar el nuevo producto en la colección "productos"
    res.status(200).json(result); // Responder con éxito y el resultado de la inserción
  } catch (error) {
    console.log(error.errInfo.details.schemaRulesNotSatisfied[0].propertiesNotSatisfied[0], "error"); // Registrar el error en la consola
    res.status(500).send("error"); // Responder con error del servidor
  }
}

// Función para actualizar un producto
export async function updateProducto(req, res) {
  if (!req.rateLimit) return; // Si no se excede el límite de tasa, no se procede
  const errors = validationResult(req); // Validar errores en la solicitud
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() }); // Si hay errores, responder con 400

  const json = transformObject(req.body); // Transformar las claves del objeto en el cuerpo de la solicitud
  const _id = req.params.id;
  let id = parseInt(_id);
  const filter = Object.assign({ id }); // Crear un filtro para buscar el producto por ID
  try {
    const db = await con(); // Conexión a la base de datos
    const result = await db.collection("productos").updateOne(filter, { $set: json }); // Actualizar el producto en la colección "productos"
    res.status(200).json(result); // Responder con éxito y el resultado de la actualización
  } catch (error) {
    console.log(error, "error"); // Registrar el error en la consola
    res.status(500).send("error"); // Responder con error del servidor
  }
}

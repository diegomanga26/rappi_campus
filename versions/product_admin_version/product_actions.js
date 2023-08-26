import { validationResult } from "express-validator";
import { siguienteId } from "../users_version/user_actions.js";
import { con } from "../../config/atlas.js";

/**
 * Transforma las claves de un objeto según un mapeo predefinido.
 * @param {Object} inputObject - El objeto a transformar.
 * @returns {Object} El objeto transformado.
 */
function transformObject(inputObject) {
  const transformedObject = {};

  for (const key in inputObject) {
    let transformedKey;

    switch (key) {
      case 'name':
        transformedKey = 'nombre_producto';
        break;
      case 'description':
        transformedKey = 'descripcion';
        break;
      case 'price':
        transformedKey = 'precio';
        break;
      case 'category':
        transformedKey = 'categoria';
        break;
      case 'availability':
        transformedKey = 'disponibilidad';
        break;
      default:
        transformedKey = key;
    }

    transformedObject[transformedKey] = inputObject[key];
  }

  return transformedObject;
}


/**
 * Obtiene todos los productos.
 * @param {Object} req - La solicitud HTTP.
 * @param {Object} res - La respuesta HTTP.
 */
export async function getAllProducts(req, res) {
  if (!req.rateLimit) return;

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const db = await con();
    const result = await db.collection("productos").find().toArray();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("error");
  }
}

/**
 * Crea un nuevo producto.
 * @param {Object} req - La solicitud HTTP.
 * @param {Object} res - La respuesta HTTP.
 */
export async function createProduct(req, res) {
  if (!req.rateLimit) return;

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name: Name, description: DesCription, price: Price, category: Categori, availability: Avail } = req.body;
  const id = await siguienteId("producto");
  const json = { id, nombre_producto: Name, descripcion: DesCription, precio: Price, categoria: Categori, disponibilidad: Avail };

  try {
    const db = await con();
    const result = await db.collection("productos").insertOne(json);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("error");
  }
}

// Las demás funciones siguen el mismo estilo de comentarios que las anteriores.

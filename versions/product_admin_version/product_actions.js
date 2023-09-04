// Importamos el módulo "express-validator" para la validación de datos
import { validationResult } from "express-validator";
// Importamos funciones necesarias de otros archivos
import { siguienteId } from "../users_version/user_actions.js";
import { con } from "../../database/config/atlas.js";


export function transformObject(inputObject) {
  const transformedObject = {};

  for (const key in inputObject) {
    if (inputObject.hasOwnProperty(key)) {
      let transformedKey;

      if (key === 'name') {
        transformedKey = 'nombre';
      } else if (key === 'email') {
        transformedKey = 'correo';
      } else if (key === 'password') {
        transformedKey = 'contrasena';
      } else if (key === 'numCelular') {
        transformedKey = 'telefono';
      } else if (key === 'address') {
        transformedKey = 'direccion';
      } else if (key === 'user_type') {
        transformedKey = 'tipo_usuario';
      } else {
        transformedKey = key;
      }

      transformedObject[transformedKey] = inputObject[key];
    }
  }

  return transformedObject;
}


export async function getAllProducts(req, res) {
  // if (!req.rateLimit) return;

  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const db = await con();
    const result = await db.collection("producto").find().toArray();
    res.status(200).json(result);
    return {message:result, status:200}
  } catch (error) {
    console.log(error, "error");
    res.status(500).send("error");
  }
}


export async function createProduct(req, res) {
  // if (!req.rateLimit) return;
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });


  const { name: Name, description: DesCription, price: Price, category: Categori, availability: Avail, user_type: tipo_usuario } = req.body;
  const id = await siguienteId("producto");
  const json = { id, nombre_producto: Name, descripcion: DesCription, precio: Price, categoria: Categori, disponibilidad: Avail };
  console.log(json);
  try {
    const db = await con();
    const result = await db.collection("producto").insertOne(json);
    res.status(200).json(result);
    return {status:200,message:result}
  } catch (error) {
    console.log(error.errInfo.details.schemaRulesNotSatisfied[0].propertiesNotSatisfied[0], "error");
    res.status(500).send("error");
    return {status:500,message:error}
  }
}



export async function updateProducto(req, res) {
  // if (!req.rateLimit) return res.status(400);
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const json = transformObject(req.body);
  const _id = req.params.id;
  let id = parseInt(_id);
  const filter = Object.assign({ id });
  try {
    const db = await con(); // Conexión a la base de datos
    const result = await db.collection("producto").updateOne(filter, { $set: json });
    res.status(200).json(result);
    return {status : 200 , data : result}
  } catch (error) {
    console.log(error, "error");
    res.status(500).send("error");
  }
}



export async function deleteProducto(req, res) {
  // if (!req.rateLimit) return {status :500};

  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const _id = req.params.id;
  let id = parseInt(_id);
  const filter = Object.assign({ id });
  try {
    const db = await con();
    const result = await db.collection("producto").updateOne(filter);
    res.status(200).json(result);
    return {status: 200, data: result}
  } catch (error) {
    console.log(error, "error");
    res.status(500).send("error");
    return {status: 500, data: error}
  }
}



export async function getAllProductsWithOutCategory(req, res) {
  // if (!req.rateLimit) return {status : 500};
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const db = await con();
    const result = await db.collection("producto").find({ categoria: req.params.categoria }).toArray();
    res.status(200).json(result);
    return {status: 200, products: result}
  } catch (error) {
    console.log(error, "error");
    res.status(500).send("error");
    return {status : 500 , error}
  }
}



export async function getAllProductsWithOutAviality(req, res) {
  // if (!req.rateLimit) return {status : 500};

  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const db = await con();
    const result = await db.collection("producto").find({ disponibilidad: true }).toArray();
    res.status(200).json(result);
    return { status : 200, results: 'success' };
  } catch (error) {
    console.log(error, "error");
    res.status(500).send("error");
    return { status : 500,error:error}
  }
}
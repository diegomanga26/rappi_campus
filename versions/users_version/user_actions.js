import { validationResult } from "express-validator";
import { con } from "../../config/atlas.js";
import { CURSOR_FLAGS } from "mongodb";

// Función asincrónica para obtener el siguiente ID de una colección
export async function siguienteId(coleccion) {
  const db = await con();
  const sequenceDocument = await db
    .collection("counters")
    .findOneAndUpdate(
      { id: `${coleccion}Id` },
      { $inc: { sequence_value: 1 } },
      { returnDocument: "after" }
    );
  return await sequenceDocument.value.sequence_value;
}

// Función para transformar las claves de un objeto
function transformObject(inputObject, keyMap) {
  // Definimos un mapeo de claves entre las claves originales y las nuevas claves deseadas

  // Creamos un objeto vacío para almacenar las claves transformadas
  const transformedObject = {};

  // Recorremos cada clave en el objeto de entrada
  for (const key in inputObject) {
    if (inputObject.hasOwnProperty(key)) {
      // Si la clave existe en el mapeo, usamos la nueva clave; de lo contrario, usamos la clave original
      transformedObject[keyMap[key] || key] = inputObject[key];
    }
  }

  // Devolvemos el objeto transformado con las nuevas claves
  return transformedObject;
}

// Función para registrar un usuario
export async function registerUsuario(req, res) {
  if (!req.rateLimit) return; // Si no se excede el límite de tasa, se retorna
  const errors = validationResult(req); // Valida los errores de la solicitud
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() }); // Si hay errores, se responde con 400
  const {
    name: Name,
    email: Mail,
    password: Password,
    numCelular: CellPhone,
    address: Address,
    user_type: tipo_usuario,
  } = req.body; // Desestructura los datos de la solicitud
  const id = await siguienteId("usuario"); // Obtiene el siguiente ID
  const json = {
    nombre: Name,
    correo: Mail,
    contrasena: Password,
    telefono: CellPhone,
    direccion: Address,
    tipo_usuario,
    id,
  }; // Crea un objeto JSON con los datos

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
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() }); // Si hay errores, se responde con 400
  const { email: Mail, password: Password } = req.body; // Desestructura los datos de la solicitud
  try {
    const db = await con(); // Conexión a la base de datos
    const user = await db
      .collection("usuario")
      .findOne({ correo: Mail, contrasena: Password }); // Busca el usuario en la colección
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

// Esta función obtiene información de un usuario según su ID.
export async function obtenerInfoUsuario(req, res) {
  if (!req.rateLimit) return; // Si no se excede el límite de tasa, se retorna
  
  const errors = validationResult(req); // Valida los errores de la solicitud
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() }); // Si hay errores, se responde con 400
  
  try {
    const db = await con(); // Conexión a la base de datos
    const user = await db.collection("usuario").findOne({ id: req.params.id }); // Busca el usuario en la colección
    
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

// Esta función actualiza la información de un usuario según su ID.
export async function actualizarUsuario(req, res) {
  if (!req.rateLimit) return; // Si no se excede el límite de tasa, se retorna
  
  const errors = validationResult(req); // Valida los errores de la solicitud
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() }); // Si hay errores, se responde con 400
  
  let keyMapping = {
    // Mapeo de las claves del objeto en el cuerpo de la solicitud a las claves en la base de datos
    name: "nombre",
    email: "correo",
    password: "contrasena",
    numCelular: "telefono",
    address: "direccion",
    user_type: "tipo_usuario",
  };
  const json = transformObject(req.body, keyMapping); // Transformar las claves del objeto en el cuerpo de la solicitud
  const _id = req.params.id;
  let id = parseInt(_id);
  const filter = Object.assign({ id }); // Crear un filtro para buscar el usuario por ID
  
  try {
    const db = await con(); // Conexión a la base de datos
    const result = await db.collection("usuario").updateOne(filter, { $set: json }); // Actualizar el usuario en la colección
    res.status(200).json(result); // Responder con éxito y el resultado de la actualización
  } catch (error) {
    console.log(error, "error"); // Registrar el error en la consola
    res.status(500).send("error"); // Responder con error del servidor
  }
}

// Esta función obtiene los pedidos realizados por un usuario según su ID.
export async function verPedidosRealizadosUsuario(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const db = await con();
    const usuario_id = req.usuario_id; // Asegúrate de obtener el usuario_id de alguna manera
    const user = await db.collection("ordenes").aggregate([
      // Agregación para obtener los detalles de los pedidos realizados por el usuario
      { $match: { user_id: usuario_id } },
      // Realiza unión con la colección "carrito" y "usuarios" para obtener información adicional
      {
        $lookup: {
          from: "carrito",
          localField: "cart_id",
          foreignField: "id",
          as: "cart",
        },
      },
      // Realiza unión con la colección "usuarios" para obtener información del repartidor
      {
        $lookup: {
          from: "usuarios",
          localField: "repartidor_id",
          foreignField: "id",
          as: "repartidor",
        },
      },
      // Proyecta la información relevante
      {
        $project: {
          _id: 0,
          id: 1,
          user_id: 1,
          fecha_hora: 1,
          direccion_entrega: 1,
          estado: 1,
          detalles_pago: 1,
          total: 1,
          repartidor_nombre: "$repartidor.nombre",
          cart_content: "$cart.content_cart",
        },
      },
    ]).toArray();

    if (user.length > 0) {
      res.status(200).json({ message: "success", user: user[0] });
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("error");
  }
}

// Esta función obtiene las órdenes asignadas a un repartidor según su ID.
export async function obtenerOrdenesPorRepartidor(req, res) {
  try {
    if (!req.rateLimit) return; // Si no se excede el límite de tasa, se retorna
    const errors = validationResult(req); // Valida los errores de la solicitud
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() }); // Si hay errores, se responde con 400

    const db = await con();
    const repartidor_id = req.params.repartidor_id; // Asegúrate de obtener el repartidor_id de alguna manera

    const ordenes = await db.collection("ordenes").aggregate([
      // Agregación para obtener las órdenes asignadas al repartidor
      { $match: { repartidor_id: repartidor_id } },
      // Realiza unión con las colecciones "carrito" y "usuarios" para obtener información adicional
      {
        $lookup: {
          from: "carrito",
          localField: "cart_id",
          foreignField: "id",
          as: "cart",
        },
      },
      {
        $lookup: {
          from: "usuarios",
          localField: "user_id",
          foreignField: "id",
          as: "usuario",
        },
      },
      // Proyecta la información relevante
      {
        $project: {
          _id: 0,
          id: 1,
          fecha_hora: 1,
          direccion_entrega: 1,
          estado: 1,
          detalles_pago: 1,
          total: 1,
          repartidor_nombre: "$repartidor_id", // Cambia esto si deseas obtener el nombre del repartidor
          cart_content: "$cart.content_cart",
          usuario_nombre: "$usuario.nombre", // Obtener el nombre del usuario
        },
      },
    ]).toArray();

    res.status(200).json({ message: "success", ordenes });
  } catch (error) {
    console.log(error);
    res.status(500).send("error");
  }
}

// Esta función actualiza la información de una orden según su ID.
export async function actualizarOrden(req, res) {
  if (!req.rateLimit) return; // Si no se excede el límite de tasa, se retorna
  const errors = validationResult(req); // Valida los errores de la solicitud
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() }); // Si hay errores, se responde con 400

  let mapper = {
    // Mapeo de las claves del objeto en el cuerpo de la solicitud a las claves en la base de datos
    "id_cart": "cart_id",
    "id_user": "user_id",
    "dateTime": "fecha_hora",
    "adress_to_send": "direccion_entrega",
    "status": "estado",
    "detalles_pago": "detalles_pago",
    "total": "total",
    "id_deliver": "repartidor_id"
  };
  const json = transformObject(req.body, mapper); // Transformar las claves del objeto en el cuerpo de la solicitud
  const _id = req.params.id;
  let id = parseInt(_id);
  const filter = Object.assign({ id }); // Crear un filtro para buscar la orden por ID

  try {
    const db = await con(); // Conexión a la base de datos
    const result = await db.collection("usuario").updateOne(filter, { $set: json }); // Actualizar la orden en la colección
    res.status(200).json(result); // Responder con éxito y el resultado de la actualización
  } catch (error) {
    console.log(error, "error"); // Registrar el error en la consola
    res.status(500).send("error"); // Responder con error del servidor
  }
}

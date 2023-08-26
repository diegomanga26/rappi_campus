import { validationResult } from "express-validator";
import { con } from "../../config/atlas.js";

/**
 * Obtiene el siguiente ID de una colección.
 * @param {string} coleccion - El nombre de la colección.
 * @returns {Promise<number>} El siguiente valor de la secuencia obtenido del documento actualizado.
 */
export async function siguienteId(coleccion) {
  const db = await con();
  const sequenceDocument = await db
    .collection("counters")
    .findOneAndUpdate(
      { id: `${coleccion}Id` },
      { $inc: { sequence_value: 1 } },
      { returnDocument: "after" }
    );
  return sequenceDocument.value.sequence_value;
}

/**
 * Registra un nuevo usuario.
 * @param {Object} req - La solicitud HTTP.
 * @param {Object} res - La respuesta HTTP.
 */
export async function registerUsuario(req, res) {
  if (!req.rateLimit) return;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, numCelular, address, user_type } = req.body;
  const id = await siguienteId("usuario");
  const newUser = { nombre: name, correo: email, contrasena: password, telefono: numCelular, direccion: address, tipo_usuario: user_type, id };

  try {
    const db = await con();
    await db.collection("usuario").insertOne(newUser);
    res.status(201).send("success");
  } catch (error) {
    console.error(error);
    res.status(500).send("error");
  }
}

/**
 * Inicia sesión de un usuario.
 * @param {Object} req - La solicitud HTTP.
 * @param {Object} res - La respuesta HTTP.
 */
export async function loginUsuario(req, res) {
  if (!req.rateLimit) return;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const db = await con();
    const user = await db.collection("usuario").findOne({ correo: email, contrasena: password });
    
    if (user) {
      res.status(200).json({ message: "success", user });
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("error");
  }
}

/**
 * Obtiene información de un usuario según su ID.
 * @param {Object} req - La solicitud HTTP.
 * @param {Object} res - La respuesta HTTP.
 */
export async function obtenerInfoUsuario(req, res) {
  if (!req.rateLimit) return;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const db = await con();
    const user = await db.collection("usuario").findOne({ id: req.params.id });

    if (user) {
      res.status(200).json({ message: "success", user });
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("error");
  }
}

/**
 * Actualiza la información de un usuario según su ID.
 * @param {Object} req - La solicitud HTTP.
 * @param {Object} res - La respuesta HTTP.
 */
export async function actualizarUsuario(req, res) {
  if (!req.rateLimit) return;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const keyMapping = {
    name: "nombre",
    email: "correo",
    password: "contrasena",
    numCelular: "telefono",
    address: "direccion",
    user_type: "tipo_usuario",
  };

  const json = transformObject(req.body, keyMapping);
  const _id = req.params.id;
  const id = parseInt(_id);
  const filter = { id };

  try {
    const db = await con();
    const result = await db.collection("usuario").updateOne(filter, { $set: json });
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("error");
  }
}

/**
 * Obtiene los pedidos realizados por un usuario según su ID.
 * @param {Object} req - La solicitud HTTP.
 * @param {Object} res - La respuesta HTTP.
 */
export async function verPedidosRealizadosUsuario(req, res) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const db = await con();
    const usuario_id = req.usuario_id;

    const user = await db.collection("ordenes").aggregate([
      { $match: { user_id: usuario_id } },
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
          localField: "repartidor_id",
          foreignField: "id",
          as: "repartidor",
        },
      },
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
    console.error(error);
    res.status(500).send("error");
  }
}

/**
 * Obtiene las órdenes asignadas a un repartidor según su ID.
 * @param {Object} req - La solicitud HTTP.
 * @param {Object} res - La respuesta HTTP.
 */
export async function obtenerOrdenesPorRepartidor(req, res) {
  try {
    if (!req.rateLimit) return;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const db = await con();
    const repartidor_id = req.params.repartidor_id;

    const ordenes = await db.collection("ordenes").aggregate([
      { $match: { repartidor_id: repartidor_id } },
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
      {
        $project: {
          _id: 0,
          id: 1,
          fecha_hora: 1,
          direccion_entrega: 1,
          estado: 1,
          detalles_pago: 1,
          total: 1,
          repartidor_nombre: "$repartidor_id",
          cart_content: "$cart.content_cart",
          usuario_nombre: "$usuario.nombre",
        },
      },
    ]).toArray();

    res.status(200).json({ message: "success", ordenes });
  } catch (error) {
    console.error(error);
    res.status(500).send("error");
  }
}

/**
 * Actualiza la información de una orden según su ID.
 * @param {Object} req - La solicitud HTTP.
 * @param {Object} res - La respuesta HTTP.
 */
export async function actualizarOrden(req, res) {
  if (!req.rateLimit) return;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const mapper = {
    id_cart: "cart_id",
    id_user: "user_id",
    dateTime: "fecha_hora",
    adress_to_send: "direccion_entrega",
    status: "estado",
    detalles_pago: "detalles_pago",
    total: "total",
    id_deliver: "repartidor_id",
  };

  const json = transformObject(req.body, mapper);
  const _id = req.params.id;
  const id = parseInt(_id);
  const filter = { id };

  try {
    const db = await con();
    const result = await db.collection("usuario").updateOne(filter, { $set: json });
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("error");
  }
}

/**
 * Crea una nueva orden y selecciona un repartidor aleatorio del tipo de usuario "repartidor".
 * @param {Object} req - La solicitud HTTP.
 * @param {Object} res - La respuesta HTTP.
 */
export async function crearOrden(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const mapper = {
    id_cart: "cart_id",
    id_user: "user_id",
    dateTime: "fecha_hora",
    adress_to_send: "direccion_entrega",
    status: "estado",
    detalles_pago: "detalles_pago",
    total: "total",
    id_deliver: "repartidor_id",
  };

  const json = transformObject(req.body, mapper);

  try {
    const db = await con();
    const repartidores = await db.collection("usuario").find({ tipo_usuario: "repartidor" }).toArray();
    const repartidorAleatorio = repartidores[Math.floor(Math.random() * repartidores.length)];
    json.id_deliver = repartidorAleatorio.id;
    const result = await db.collection("orden").insertOne(json);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("error");
  }
}

// Función para transformar las claves de un objeto
function transformObject(inputObject, keyMap) {
  const transformedObject = {};
  for (const key in inputObject) {
    if (inputObject.hasOwnProperty(key)) {
      transformedObject[keyMap[key] || key] = inputObject[key];
    }
  }
  return transformedObject;
}

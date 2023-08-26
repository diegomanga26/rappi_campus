import { validationResult } from "express-validator";
import { con } from "../../config/atlas.js";
import { CURSOR_FLAGS } from "mongodb";

// Función asincrónica para obtener el siguiente ID de una colección
export async function siguienteId(coleccion) {
  const db = await con(); // Conexión a la base de datos

  // Busca el documento de secuencia correspondiente a la colección y actualiza su valor
  const sequenceDocument = await db.collection("counters").findOneAndUpdate(
    { id: `${coleccion}Id` }, // Filtro para encontrar el documento de secuencia
    { $inc: { sequence_value: 1 } }, // Incrementa el valor de la secuencia en 1
    { returnDocument: "after" } // Devuelve el documento actualizado
  );

  // Retorna el siguiente valor de la secuencia obtenido del documento actualizado
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

// Función para registrar un nuevo usuario
export async function registerUsuario(req, res) {
  // Verifica si no se excede el límite de tasa, si es así, la función retorna
  if (!req.rateLimit) return;

  // Valida los errores de la solicitud usando express-validator
  const errors = validationResult(req);

  // Si hay errores de validación, responde con un estado 400 y la lista de errores en formato JSON
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Desestructura los datos de la solicitud (nombre, correo, contraseña, etc.)
  const {
    name: Name,
    email: Mail,
    password: Password,
    numCelular: CellPhone,
    address: Address,
    user_type: tipo_usuario,
  } = req.body;

  // Obtiene el siguiente ID de usuario usando la función siguienteId y la colección "usuario"
  const id = await siguienteId("usuario");

  // Crea un objeto JSON con los datos del usuario
  const json = {
    nombre: Name,
    correo: Mail,
    contrasena: Password,
    telefono: CellPhone,
    direccion: Address,
    tipo_usuario,
    id,
  };

  try {
    // Establece una conexión a la base de datos
    const db = await con();

    // Inserta el objeto JSON del usuario en la colección "usuario"
    await db.collection("usuario").insertOne(json);

    // Responde con un estado 201 (creado) y un mensaje de éxito
    res.status(201).send("success");
  } catch (error) {
    // Si ocurre un error durante el proceso, registra el error en la consola
    console.log(error, "error");

    // Responde con un estado 500 (error interno del servidor) y un mensaje de error
    res.status(500).send("error");
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
// Función para obtener los pedidos realizados por un usuario
export async function verPedidosRealizadosUsuario(req, res) {
  try {
    // Valida los errores de la solicitud usando express-validator
    const errors = validationResult(req);

    // Si hay errores de validación, responde con un estado 400 y la lista de errores en formato JSON
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Establece una conexión a la base de datos
    const db = await con();

    // Obtiene el usuario_id de alguna manera (asegúrate de que está disponible en req.usuario_id)
    const usuario_id = req.usuario_id;

    // Realiza una agregación en la colección "ordenes" para obtener los detalles de los pedidos realizados por el usuario
    const user = await db.collection("ordenes").aggregate([
      { $match: { user_id: usuario_id } }, // Filtra las órdenes del usuario actual
      {
        $lookup: {
          from: "carrito",
          localField: "cart_id",
          foreignField: "id",
          as: "cart",
        },
      }, // Realiza unión con la colección "carrito" para obtener detalles del carrito
      {
        $lookup: {
          from: "usuarios",
          localField: "repartidor_id",
          foreignField: "id",
          as: "repartidor",
        },
      }, // Realiza unión con la colección "usuarios" para obtener información del repartidor
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
      }, // Proyecta la información relevante
    ]).toArray();

    // Si se encontraron órdenes para el usuario, responde con un estado 200 y el primer resultado
    if (user.length > 0) {
      res.status(200).json({ message: "success", user: user[0] });
    } else {
      // Si no se encontraron órdenes, responde con un estado 404 y un mensaje indicando que no se encontró el usuario
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    // Si ocurre un error durante el proceso, registra el error en la consola
    console.log(error);

    // Responde con un estado 500 (error interno del servidor) y un mensaje de error
    res.status(500).send("error");
  }
}


// Esta función obtiene las órdenes asignadas a un repartidor según su ID.
export async function obtenerOrdenesPorRepartidor(req, res) {
  try {
    // Si no se excede el límite de tasa, se retorna sin continuar
    if (!req.rateLimit) return;

    // Valida los errores de la solicitud utilizando express-validator
    const errors = validationResult(req);

    // Si hay errores de validación, responde con un estado 400 y la lista de errores en formato JSON
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Establecer una conexión a la base de datos
    const db = await con();

    // Obtener el ID del repartidor desde los parámetros de la solicitud
    const repartidor_id = req.params.repartidor_id; // Asegúrate de obtener el repartidor_id de alguna manera

    // Realizar una agregación para obtener las órdenes asignadas al repartidor
    const ordenes = await db.collection("ordenes").aggregate([
      // Agregación para filtrar las órdenes por repartidor_id
      { $match: { repartidor_id: repartidor_id } },
      // Realizar unión con las colecciones "carrito" y "usuarios" para obtener información adicional
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
      // Proyectar la información relevante para la respuesta
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

    // Responder con un estado 200 y un mensaje de éxito junto con las órdenes obtenidas en formato JSON
    res.status(200).json({ message: "success", ordenes });
  } catch (error) {
    // Si ocurre un error durante el proceso, registrar el error en la consola
    console.log(error);

    // Responder con un estado 500 (error interno del servidor) y un mensaje de error
    res.status(500).send("error");
  }
}


// Esta función actualiza la información de una orden según su ID.
export async function actualizarOrden(req, res) {
  // Si no se excede el límite de tasa, se retorna sin continuar
  if (!req.rateLimit) return;

  // Valida los errores de la solicitud utilizando express-validator
  const errors = validationResult(req);

  // Si hay errores de validación, responde con un estado 400 y la lista de errores en formato JSON
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Mapeo de las claves del objeto en el cuerpo de la solicitud a las claves en la base de datos
  let mapper = {
    "id_cart": "cart_id",
    "id_user": "user_id",
    "dateTime": "fecha_hora",
    "adress_to_send": "direccion_entrega",
    "status": "estado",
    "detalles_pago": "detalles_pago",
    "total": "total",
    "id_deliver": "repartidor_id"
  };

  // Transformar las claves del objeto en el cuerpo de la solicitud utilizando la función transformObject
  const json = transformObject(req.body, mapper);

  // Obtener el ID de la orden desde los parámetros de la solicitud
  const _id = req.params.id;
  let id = parseInt(_id);

  // Crear un filtro para buscar la orden por ID
  const filter = Object.assign({ id });

  try {
    // Establecer una conexión a la base de datos
    const db = await con();

    // Actualizar la orden en la colección "usuario" utilizando la función updateOne
    const result = await db.collection("usuario").updateOne(filter, { $set: json });

    // Responder con un estado 200 y el resultado de la actualización en formato JSON
    res.status(200).json(result);
  } catch (error) {
    // Si ocurre un error durante el proceso, registrar el error en la consola
    console.log(error, "error");

    // Responder con un estado 500 (error interno del servidor) y un mensaje de error
    res.status(500).send("error");
  }
}


// Esta función crea una nueva orden y selecciona un repartidor aleatorio del tipo de usuario "repartidor".
export async function crearOrden(req, res) {
  // Valida los errores de la solicitud utilizando express-validator
  const errors = validationResult(req);

  // Si hay errores de validación, responde con un estado 400 y la lista de errores en formato JSON
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Mapeo de las claves del objeto en el cuerpo de la solicitud a las claves en la base de datos
  let mapper = {
    "id_cart": "cart_id",
    "id_user": "user_id",
    "dateTime": "fecha_hora",
    "adress_to_send": "direccion_entrega",
    "status": "estado",
    "detalles_pago": "detalles_pago",
    "total": "total",
    "id_deliver": "repartidor_id"
  };


  // Transformar las claves del objeto en el cuerpo de la solicitud utilizando la función transformObject
  const json = transformObject(req.body, mapper);

  try {
    // Establecer una conexión a la base de datos
    const db = await con();

    // Obtener la lista de usuarios con el tipo de usuario "repartidor"
    const repartidores = await db.collection("usuario").find({ tipo_usuario: "repartidor" }).toArray();

    // Elegir un repartidor aleatorio de la lista
    const repartidorAleatorio = repartidores[Math.floor(Math.random() * repartidores.length)];

    // Agregar el ID del repartidor seleccionado al objeto JSON
    json.id_deliver = repartidorAleatorio.id;

    // Insertar la nueva orden en la colección "orden" utilizando la función insertOne
    const result = await db.collection("orden").insertOne(json);

    // Responder con un estado 201 (creado) y el resultado de la inserción en formato JSON
    res.status(201).json(result);
  } catch (error) {
    // Si ocurre un error durante el proceso, registrar el error en la consola
    console.log(error, "error");

    // Responder con un estado 500 (error interno del servidor) y un mensaje de error
    res.status(500).send("error");
  }
}


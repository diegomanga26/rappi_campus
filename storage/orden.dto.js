import { check } from "express-validator";
import { con } from "../database/config/atlas.js";

const validateCartContent = async (value) => {
  if (!Array.isArray(value)) {
    throw new Error("cart_content debe ser un arreglo");
  }

  try {
    const db = await con();
    const productosCollection = db.collection("producto");

    // Consultar la base de datos para verificar si 'a' está en el array
    const result = await productosCollection.find().toArray();

    const hasA = result.some((producto) => producto.cart_content.includes(req.body));

    if (!hasA) {
      throw new Error(
        'El elemento "a" no se encuentra en el array en la base de datos'
      );
    }
  } finally {
    // Asegúrate de cerrar la conexión a la base de datos
    client.close();
  }

  // Si todo está bien, devuelve el valor
  return value;
};

export const orderDto = [
  check("cart_content")
    .isArray()
    .withMessage("cart_content is required"),
  check("id_user").isInt().notEmpty().withMessage("id_user is required"),
  check("adress_to_send")
    .isString()
    .notEmpty()
    .withMessage("adress_to_send is required"),
  check("status").isString().notEmpty().withMessage("status is required"),
  check("detalles_pago")
    .isString()
    .notEmpty()
    .withMessage("detalles_pago is required"),
  check("total").isNumeric().notEmpty().withMessage("total is required"),
  check("id_deliver").isInt().notEmpty().withMessage("id_deliver is required"),
];

export const orderDtoUpdate = [
  check("cart_content").isArray().optional(),
  check("id_user").isInt().optional(),
  check("dateTime").isDate().optional(),
  check("adress_to_send").isString().optional(),
  check("status").isString().optional(),
  check("detalles_pago").isString().optional(),
  check("total").isNumeric().optional(),
  check("id_deliver").isInt().optional(),
];

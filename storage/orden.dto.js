import { check } from "express-validator";

export const orderDto = [
  check("id_cart").isArray().notEmpty().withMessage("id_cart is required"),
  check("id_user").isInt().notEmpty().withMessage("id_user is required"),
  check("dateTime").isDate().notEmpty().withMessage("dateTime is required"),
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
  check("id_cart").isArray().withMessage("id_cart is required"),
  check("id_user").isInt().withMessage("id_user is required"),
  check("dateTime").isDate().withMessage("dateTime is required"),
  check("adress_to_send").isString().withMessage("adress_to_send is required"),
  check("status").isString().withMessage("status is required"),
  check("detalles_pago").isString().withMessage("detalles_pago is required"),
  check("total").isNumeric().withMessage("total is required"),
  check("id_deliver").isInt().withMessage("id_deliver is required"),
];

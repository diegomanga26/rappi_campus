import { validationResult } from "express-validator";
import { con } from "../database/config/atlas.js";

// Importa las funciones a testear
import {
  transformObject,
  updateProducto,
  createProduct,
  getAllProducts,
  deleteProducto,
  getAllProductsWithOutCategory,
  getAllProductsWithOutAviality,
} from "../versions/product_admin_version/product_actions.js";
import { siguienteId } from "../versions/users_version/user_actions.js";

const mockReq = { rateLimit: true, body: {}, params: { categoria: "" } };
const mockRes = {
  status: function (statusCode) {
    this.statusCode = statusCode;
    return this;
  },
  json: function (data) {
    this.data = data;
    return this;
  },
  send: function (message) {
    this.message = message;
    return this;
  },
};

// Funciones para testear `getAllProducts()`
it("Devuelve todos los productos", async () => {
  const errors = validationResult;
  if (!errors) {
    console.log(errors.array());
  }
  // expect(errors.isEmpty()).toBe(true);

  const result = await getAllProducts(mockReq, mockRes);
  expect(result).toBeDefined();
});

// Funciones para testear `createProduct()`
it("Crea un nuevo producto correctamente", async () => {
  mockReq.body = {
    name: "Producto 1",
    description: "Este es un producto",
    price: 100.01,
    category: "Electrónica",
    availability: true,
  };
  const errors = validationResult(mockReq);
  if (!errors.isEmpty()) {
    console.log(errors.array());
  }
  expect(errors.isEmpty()).toBe(true);

  const result = await createProduct(mockReq, mockRes);
  //console.log(result.message.errInfo.details.schemaRulesNotSatisfied[0]);
  expect(result.status).toBe(200);
});

it("Devuelve todos los productos sin una categoría específica", async () => {
  const errors = validationResult(mockReq);
  if (!errors.isEmpty()) {
    console.log(errors.array());
  }
  expect(errors.isEmpty()).toBe(true);
  mockReq.params.categoria = "farmacos";

  const result = await getAllProductsWithOutCategory(mockReq, mockRes);
  expect(result.status).toBe(200);
});

// Funciones para testear `getAllProductsWithOutAviality()`
it("Devuelve todos los productos con disponibilidad", async () => {
  const errors = validationResult(mockReq);
  if (!errors.isEmpty()) {
    console.log(errors.array());
  }
  expect(errors.isEmpty()).toBe(true);

  const result = await getAllProductsWithOutAviality(mockReq, mockRes);
  expect(result.status).toBe(200);
});

// Funciones para testear `updateProducto()`
it("Actualiza un producto existente correctamente", async () => {
  const errors = validationResult(mockReq);
  if (!errors.isEmpty()) {
    console.log(errors.array());
  }
  expect(errors.isEmpty()).toBe(true);

  const result = await updateProducto(mockReq, mockRes);
  expect(result).toBeDefined();
});

// Funciones para testear `deleteProducto()`
it("Elimina un producto existente correctamente", async () => {
  const result = await deleteProducto(mockReq, mockRes);
  expect(result).toBeDefined();
});

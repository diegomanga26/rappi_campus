import { validationResult } from "express-validator";
import { con } from "../database/config/atlas.js";

// Importa las funciones a testear
import { transformObject,updateProducto,createProduct,getAllProducts, } from "../versions/product_admin_version/product_actions.js";
import { siguienteId } from "../versions/users_version/user_actions.js";

const mockReq = { rateLimit: true, body: {} };
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
  }
};

// Funciones para testear `getAllProducts()`
it("Devuelve todos los productos", async () => {
  const errors = validationResult;
  if (!errors) {
    console.log(errors.array());
  }
  // expect(errors.isEmpty()).toBe(true);

  const result = await getAllProducts(mockReq,mockRes);
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


it("No crea un producto con un nombre vacío", async () => {
  const errors = validationResult({
    name: "",
    description: "Este es un producto",
    price: 100,
    category: "licores",
    availability: true,
  });
  expect(!errors.isEmpty()).toBe(false);
  expect(errors.array()).toBe("name");
  expect(errors.array()[0].message).toBe(
    "El nombre del producto no puede estar vacío"
  );
});

// Funciones para testear `updateProducto()`
it("Actualiza un producto existente correctamente", async () => {
  const errors = validationResult({
    name: "Producto 1",
    description: "Este es un producto actualizado",
    price: 100,
    category: "Electrónica",
    availability: true,
  });
  if (!errors.isEmpty()) {
    console.log(errors.array());
  }
  expect(errors.isEmpty()).toBe(true);

  const result = await updateProducto();
  expect(result).toBeDefined();
});

// Funciones para testear `deleteProducto()`
it("Elimina un producto existente correctamente", async () => {
  const errors = validationResult();
  if (!errors.isEmpty()) {
    console.log(errors.array());
  }
  expect(errors.isEmpty()).toBe(true);

  const result = await deleteProducto();
  expect(result).toBeDefined();
});

// Funciones para testear `getAllProductsWithOutCategory()`
it("Devuelve todos los productos sin una categoría específica", async () => {
  const errors = validationResult();
  if (!errors.isEmpty()) {
    console.log(errors.array());
  }
  expect(errors.isEmpty()).toBe(true);

  const result = await getAllProductsWithOutCategory();
  expect(result).toBeDefined();
});

// Funciones para testear `getAllProductsWithOutAviality()`
it("Devuelve todos los productos con disponibilidad", async () => {
  const errors = validationResult();
  if (!errors.isEmpty()) {
    console.log(errors.array());
  }
  expect(errors.isEmpty()).toBe(true);

  const result = await getAllProductsWithOutAviality();
  expect(result).toBeDefined();
});

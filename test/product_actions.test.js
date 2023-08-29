import { validationResult } from "express-validator";
import { con } from "../config/atlas.js";

// Importa las funciones a testear
import { transformObject } from "../versions/product_admin_version/product_actions.js";
import { siguienteId } from "../versions/users_version/user_actions.js";

// Funciones para testear `getAllProducts()`
it("Devuelve todos los productos", async () => {
  const errors = validationResult;
  if (!errors.isEmpty()) {
    console.log(errors.array());
  }
  expect(errors.isEmpty()).toBe(true);

  const result = await getAllProducts();
  expect(result).toBeDefined();
});

// Funciones para testear `createProduct()`
it("Crea un nuevo producto correctamente", async () => {
  const errors = validationResult({
    name: "Producto 1",
    description: "Este es un producto",
    price: 100,
    category: "Electrónica",
    availability: true,
  });
  if (!errors.isEmpty()) {
    console.log(errors.array());
  }
  expect(errors.isEmpty()).toBe(true);

  const result = await createProduct();
  expect(result).toBeDefined();
});

it("No crea un producto con un nombre vacío", async () => {
  const errors = validationResult({
    name: "",
    description: "Este es un producto",
    price: 100,
    category: "Electrónica",
    availability: true,
  });
  expect(errors.isEmpty()).toBe(false);
  expect(errors.array()[0].param).toBe("name");
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

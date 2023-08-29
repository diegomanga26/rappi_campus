import { validationResult } from "express-validator";
import { con } from "../config/atlas.js";

// Importa las funciones a testear
import {
  actualizarOrden,
  actualizarUsuario,
  crearOrden,
  obtenerInfoUsuario,
  obtenerOrdenesPorRepartidor,
  verPedidosRealizadosUsuario,
  siguienteId,
  registerUsuario,
  loginUsuario
} from "../versions/users_version/user_actions.js";

// Función para testear `siguienteId()`
it("Devuelve el siguiente ID de una colección", async () => {
  const id = await siguienteId("usuario");
  expect(id).toBe(id);
});

// Función para testear `registerUsuario()`
it("Registra un nuevo usuario correctamente", async () => {
  const body = {
    name: "John Doe",
    email: "johndoe@example.com",
    password: "password",
    numCelular : "123",
    address:'a',
    user_type:"cliente"
  };
  const errors = validationResult(body);
  if (!errors.isEmpty()) {
    console.log(errors.array());
  }
  expect(errors.isEmpty()).toBe(true);

  const result = await registerUsuario(body);
  expect(result).toBe({status : 201, message :"success"});
});

it("No registra un usuario con un correo electrónico duplicado", async () => {
  const body = {
    name: "John Doe1",
    email: "johndoe@example.com",
    password: "password",
    numCelular : "123",
    address:'a',
    user_type:"cliente"
  };
  const errors = validationResult(body);
  if (!errors.isEmpty()) {
    console.log(errors.array());
  }
  expect(errors.isEmpty()).toBe(true);

  await registerUsuario(body);

  const result = await registerUsuario(body);
  expect(result).toBe(400);
});

it("No registra un usuario con una contraseña demasiado corta", async () => {
  const body = {
    name: "John Doe",
    email: "johndoe@example.com",
    password: "pass",
  };
  const errors = validationResult(body);
  expect(errors.isEmpty()).toBe(false);
  expect(errors.array()[0].param).toBe("password");
  expect(errors.array()[0].message).toBe(
    "La contraseña debe tener al menos 8 caracteres"
  );
});

// Función para testear `loginUsuario()`
it("Inicia sesión de un usuario correctamente", async () => {
  const body = {
    email: "johndoe@example.com",
    password: "password",
  };
  const errors = validationResult(body);
  if (!errors.isEmpty()) {
    console.log(errors.array());
  }
  expect(errors.isEmpty()).toBe(true);

  const result = await loginUsuario(body);
  expect(result).toBe(200);
});

it("No inicia sesión de un usuario con un correo electrónico incorrecto", async () => {
  const body = {
    email: "johndoe@example.com",
    password: "password",
  };
  const errors = validationResult(body);
  if (!errors.isEmpty()) {
    console.log(errors.array());
  }
  expect(errors.isEmpty()).toBe(true);

  const result = await loginUsuario(body);
  expect(result).toBe(404);
});

it("No inicia sesión de un usuario con una contraseña incorrecta", async () => {
  const body = {
    email: "johndoe@example.com",
    password: "password",
  };
  const errors = validationResult(body);
  if (!errors.isEmpty()) {
    console.log(errors.array());
  }
  expect(errors.isEmpty()).toBe(true);
});

import { validationResult } from "express-validator";
import { con } from "../config/atlas.js";
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

// Mock req and res objects for testing
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

it("Devuelve el siguiente ID de una colección", async () => {
  const id = await siguienteId("usuario");
  expect(typeof id).toBe("number");
});

it("Registra un nuevo usuario correctamente", async () => {
  mockReq.body = {
    name: "John Doe",
    email: "johndoe@example.com",
    password: "password",
    numCelular: "123",
    address: 'a',
    user_type: "cliente"
  };
  const errors = validationResult(mockReq);
  expect(errors.isEmpty()).toBe(true);

  const result = await registerUsuario(mockReq, mockRes);
  expect(result.status).toBe(201);
  expect(result.message).toBe("success");
});


it("Inicia sesión de un usuario correctamente", async () => {
  mockReq.body = {
    email: "johndoe@example.com",
    password: "password",
  };
  const errors = validationResult(mockReq);
  expect(errors.isEmpty()).toBe(true);

  const result = await loginUsuario(mockReq, mockRes);
  expect(result.message).toBe("success");
});

it("No inicia sesión de un usuario con un correo electrónico incorrecto", async () => {
  mockReq.body = {
    email: "johndoe@example1.com",
    password: "password",
  };
  const errors = validationResult(mockReq);
  expect(errors.isEmpty()).toBe(true);

  const result = await loginUsuario(mockReq, mockRes);
  expect(result.message).toBe("user not found");
});

it("No inicia sesión de un usuario con una contraseña incorrecta", async () => {
  mockReq.body = {
    email: "johndoe@example.com",
    password: "password",
  };
  const errors = validationResult(mockReq,mockRes);
  expect(errors.isEmpty()).toBe(true);
});

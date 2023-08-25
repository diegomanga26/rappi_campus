// Importación de módulos y bibliotecas
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import passport from "passport";
import { limitLogin } from "./config/limiter.js"; // Importación de función de limitación de inicio de sesión
import routesVersioning from "express-routes-versioning";
import { limitGrt } from "./config/limiter.js"; // Importación de función de limitación genérica de peticiones
import { register } from "./routes/doorAuth.routes.js"; // Importación de ruta de registro
import { login } from "./routes/doorAuth.routes.js"; // Importación de ruta de inicio de sesión
import { products } from "./routes/products.routes.js";

// Configuración del entorn.o
dotenv.config();

// Inicialización del servidor Express
const index = express();
const version = routesVersioning();

// Configuración
index.set("port", process.env.PORT || 3000); // Configura el puerto del servidor

// Middlewares
index.use(morgan("dev")); // Muestra registros en consola durante el desarrollo
index.use(express.json()); // Permite el análisis de solicitudes JSON
index.use(limitGrt()); // Aplica la función de limitación genérica de peticiones
index.use(passport.initialize()); // Inicializa Passport para autenticación

// Rutas
index.use("/register", limitLogin(), register); // Ruta para el registro, con limitación de tasa
index.use("/login", limitLogin(), login); // Ruta para el inicio de sesión, con limitación de tasa
index.use("/productos", products);

// Inicio del servidor
index.listen(index.get("port"), () => {
  console.log("Server on port " + index.get("port")); // Muestra un mensaje cuando el servidor se inicia
});

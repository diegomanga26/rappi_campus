import express from "express";
import dotenv from "dotenv";
import routerEnd from "./routes/indexRoutes.js";

dotenv.config();
const index = express();

// Inicio del servidor
index.use(express.json());
index.use('/', routerEnd)

let config = JSON.parse(process.env.myServer);
index.listen(config, () => {
  console.log(`http://${config.hostname}:${config.port}`);
});

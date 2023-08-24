import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import passport from "passport";
import routesVersioning from "express-routes-versioning";
import { limitGrt } from "./config/limiter.js";
import { register } from "./routes/doorAuth.routes.js";

//config environment
dotenv.config();

// Initialize server
const index = express();
const version = routesVersioning();

// Setting
index.set("port", process.env.PORT || 3000);

// Middlewares
index.use(morgan("dev"));
index.use(express.json());
index.use(limitGrt());
index.use(passport.initialize());

// Routes
index.use('/register',register);


// Server
index.listen(index.get("port"), () => {
  console.log("Server on port " + index.get("port"));
});
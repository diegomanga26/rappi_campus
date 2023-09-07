// middleware/auth.js
import { jwtVerify } from "jose";
import dotenv from "dotenv";

dotenv.config();

const connectionDb = await con();

async function authenticateJWT(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  try {
    const encoder = new TextEncoder();
    const jwtData = await jwtVerify(
      authorization.replace("Bearer ", ""), // Elimina "Bearer " del token
      encoder.encode(process.env.JWT_PRIVATE_KEY)
    );

    req.jwtData = jwtData;

    next();
  } catch (error) {
    res.status(403).json({ message: "Token inválido" });
  }
}

export default authenticateJWT;

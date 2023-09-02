import express from "express";
import { tokenCreate } from "../middlewares/JWT.js";

const appToken = express();

appToken.get('/', tokenCreate);

export default appToken;
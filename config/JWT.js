import {con} from "./atlas.js";
import { SignJWT, jwtVerify } from "jose"
import { ObjectId } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();

const conexionDB = await con();
const tokenCreate = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) return res.status(400).send({message: "Data not sent."});
    try {
        const result = await conexionDB.collection('usuario').findOne(req.body);
        console.log(result);
        const id = result._id.toString();
        const encoder = new TextEncoder();
        const jwtconstructor = await new SignJWT({ id: id});
        const jwt = await jwtconstructor
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setIssuedAt()
        .setExpirationTime("3h")
        .sign(encoder.encode(process.env.JWT_PASSWORD));
        res.send(jwt)
    } catch (error) {
        res.status(404).send({ status: 404, message: "Collection not found" })
    }
    next();  
}
const validarToken = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) return res.status(400).send({ status: 400, token: "Token not sent" });
    try {
        const encoder = new TextEncoder();
        const jwtData = await jwtVerify(
            authorization,
            encoder.encode(process.env.JWT_PASSWORD)
        );
        req.data = jwtData;
        let result = await conexionDB.collection('usuario').findOne({_id:new ObjectId(jwtData.payload.id)})
        if(!(req.baseUrl in result.permisos)) return res.json({status:404,message: 'The endpoint is not allowed'})
        let versiones = result.permisos[req.baseUrl];
        if(!(versiones.includes(req.headers["accept-version"]))) return res.json({status:404,message: 'The version is not allowed'})
        const allowedMethods = result.permisos[req.baseUrl];
        const currentMethod = req.method.toLowerCase();
        if (!allowedMethods.includes(currentMethod)) return res.json({status:404, message: 'The method is not allowed'});
        next();
    } catch (error) {
        res.status(498).json({ status: 498, message: error.message })
    }
}
export {
    tokenCreate,
    validarToken
}
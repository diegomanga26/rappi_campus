import { con } from "../database/config/atlas.js";
import { SignJWT, jwtVerify } from "jose";
import dotenv from 'dotenv';
import { ObjectId } from "mongodb";

dotenv.config();
const connectionDb = await con();

const tokenCreate = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) return res.status(400).send({ message: "No data sent." });
    
    try {
        const result = await connectionDb.collection(req.query.rol).findOne(req.body);
        const rol = result.rol;
        const result2 = await connectionDb.collection('rol').findOne({ _id:rol });
        const {_id, permisos} = result2;
        const encoder = new TextEncoder();
        const jwtconstructor = await new SignJWT({ _id:  new ObjectId(_id), permisos:  new Object(permisos)});
        const jwt = await jwtconstructor
            .setProtectedHeader({ alg: "HS256", typ: "JWT" })
            .setIssuedAt()
            .setExpirationTime("30m")
            .sign(encoder.encode(process.env.JWT_PRIVATE_KEY));
        res.send(jwt);

    } catch (error) {
        res.status(404).send({ status: 404, message: "Collection not found." });
    }
    next();
};

const tokenValidate = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) return res.status(400).send({ status: 400, token: "Token not sent" });
    try {
        const encoder = new TextEncoder();
        const jwtData = await jwtVerify(
            authorization,
            encoder.encode(process.env.JWT_PRIVATE_KEY)
        );
        req.data = jwtData;
        const tokenId = new ObjectId(jwtData.payload._id);
        const rol = await connectionDb.collection('rol').findOne({ _id: tokenId });
        const allowedEndpoints = Object.keys(rol.permisos);
        
        if (!allowedEndpoints.includes("/colecciones")) {
            if (!allowedEndpoints.includes(req.baseUrl)) {
                return res.json({ status: 404, message: 'You cannot access this endpoint.' });
            }
            
            const allowedVersions = rol.permisos[req.baseUrl];
            if (!allowedVersions.includes(req.headers["accept-version"])) {
                return res.json({ status: 404, message: 'You cannot access this version.' });
            }
        }
        next();
    } catch (error) {
        res.status(498).json({ status: 498, message: error.message });
    }
}; 


const tokenCreates = async (requestData) => {
    if (Object.keys(requestData.body).length === 0) return { status: 400, message: "No data sent." };
    
    try {
        const result = await connectionDb.collection(requestData.query.rol).findOne(requestData.body);
        const rol = result.rol;
        const result2 = await connectionDb.collection('rol').findOne({ _id: rol });
        const { _id, permisos } = result2;
        const encoder = new TextEncoder();
        const jwtconstructor = await new SignJWT({ _id: new ObjectId(_id), permisos: new Object(permisos) });
        const jwt = await jwtconstructor
            .setProtectedHeader({ alg: "HS256", typ: "JWT" })
            .setIssuedAt()
            .setExpirationTime("30m")
            .sign(encoder.encode(process.env.JWT_PRIVATE_KEY));
        return { jwt };
    } catch (error) {
        return { status: 404, message: "Collection not found." };
    }
};

// No es necesario llamar a next() ya que no estás pasando la solicitud al siguiente middleware.

export {
    tokenCreate,
    tokenCreates,
    tokenValidate
};
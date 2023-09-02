import { con } from "../database/config/atlas.js";
import { SignJWT, jwtVerify } from "jose";
import dotenv from 'dotenv';
import { ObjectId } from "mongodb";
dotenv.config();

const connectionDb = await con();

const tokenCreate = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) return res.status(400).send({ message: "No data sent." });
    
    try {
        let {rol}= req.body;
        const result = await connectionDb.collection("rol").findOne({rol: new ObjectId(rol)});
        console.log(result);
        const encoder = new TextEncoder();
        const jwtconstructor = await new SignJWT({ id: id.toString(), rol:new ObjectId(rol) });
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
            encoder.encode(process.env.JWT_PASSWORD)
        );
        req.data = jwtData;
        const tokenId = jwtData.payload.rol;
        const rol = await connectionDb.collection('rol').findOne({ _id: tokenId });
        const allowedEndpoints = Object.keys(rol.permisos);
        if (!allowedEndpoints.includes(req.baseUrl)) {
            return res.json({ status: 404, message: 'You cannot access this endpoint.' });
        }
        
        const allowedVersions = rol.permisos[req.baseUrl];
        if (!allowedVersions.includes(req.headers["accept-version"])) {
            return res.json({ status: 404, message: 'You cannot access this version.' });
        }

        next();
    } catch (error) {
        res.status(498).json({ status: 498, message: error.message });
    }
};

export {
    tokenCreate,
    tokenValidate
};
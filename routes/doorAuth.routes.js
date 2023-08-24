import { Router } from "express";
import { registerDto } from "../storage/door.dto.js";
import { validationResult } from "express-validator";

export const register = Router();

register.post('/', registerDto,(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())return res.status(400).json({ errors: errors.array() });
    res.send('ok');
})
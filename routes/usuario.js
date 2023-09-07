import { Router } from "express";
import { orderDto, orderDtoUpdate } from "../storage/orden.dto.js";
import { updateUserDto } from "../storage/user.dto.js";
import routesVersioning from "express-routes-versioning";
import {
    actualizarOrden,
    actualizarUsuario,
    crearOrden,
    obtenerInfoUsuario,
    obtenerOrdenesPorRepartidor,
    verPedidosRealizadosUsuario,
} from "../versions/users_version/user_actions.js";
import { tokenValidate } from "../middlewares/JWT.js";
import { limitGrt } from "../middlewares/limiter.js";

const appUsuario = Router();
const version = routesVersioning();
appUsuario.use(tokenValidate, limitGrt());

appUsuario.get(
    "/cliente/:id",
    version({
        "3.0.0": obtenerInfoUsuario,
        fallbackVersion: "2.0.0",
    })
);
appUsuario.get(
    "/repartidor/:id",
    version({
        "3.0.0": obtenerInfoUsuario,
        fallbackVersion: "2.0.0",
    })
);
appUsuario.put(
    "/repartidor/:id",
    updateUserDto,
    version({
        "3.0.0": actualizarUsuario,
        fallbackVersion: "2.0.0",
    })
);
appUsuario.put(
    "/cliente/:id",
    updateUserDto,
    version({
        "3.0.0": actualizarUsuario,
        fallbackVersion: "2.0.0",
    })
);
appUsuario.get(
    "/cliente/pedido/:id",
    version({
        "3.0.0": verPedidosRealizadosUsuario,
        fallbackVersion: "2.0.0",
    })
);
appUsuario.get(
    "/repartidor/entregas/:id",
    version({
        "3.0.0": obtenerOrdenesPorRepartidor,
        fallbackVersion: "2.0.0",
    })
);
appUsuario.put(
    "/cliente/pedido/:id",
    orderDtoUpdate,
    version({
        "3.0.0": actualizarOrden,
        fallbackVersion: "2.0.0",
    })
);
appUsuario.post(
    "/cliente/pedido",
    orderDto,
    version({
        "3.0.0": crearOrden,
        fallbackVersion: "2.0.0",
    })
);

export default appUsuario;

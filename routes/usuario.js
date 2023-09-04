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
    })    
);
appUsuario.get(
    "/repartidor/:id",
    version({
        "3.0.0": obtenerInfoUsuario,
    })
);
appUsuario.put(
    "/repartidor/:id",
    updateUserDto,
    version({
        "3.0.0": actualizarUsuario,
    })
);
appUsuario.put(
    "/cliente/:id",
    updateUserDto,
    version({
        "3.0.0": actualizarUsuario,
    })
);
appUsuario.get(
    "/cliente/pedido/:id",
    version({
        "3.0.0": verPedidosRealizadosUsuario,
    })
);
appUsuario.get("/repartidor/entregas/:id",   version({
    "3.0.0": obtenerOrdenesPorRepartidor,
    }));
appUsuario.put("/cliente/pedido/:id", orderDtoUpdate, version({
    "3.0.0": actualizarOrden,
    }));  
appUsuario.post("/cliente/pedido", orderDto, version({
    "3.0.0": crearOrden,
    }));
    
export default appUsuario;
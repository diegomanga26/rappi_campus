import { Router } from "express";
import { orderDto, orderDtoUpdate } from "../storage/orden.dto.js";
import { updateUserDto } from "../storage/user.dto.js";
import { actualizarOrden,actualizarUsuario,crearOrden,obtenerInfoUsuario,obtenerOrdenesPorRepartidor,verPedidosRealizadosUsuario } from "../versions/users_version/user_actions.js";
import { tokenValidate } from "../middlewares/JWT.js";


const appUsuario = Router();
appUsuario.use(tokenValidate);

appUsuario.get('/cliente/:id', obtenerInfoUsuario );
appUsuario.get('/repartidor/:id', obtenerInfoUsuario);
appUsuario.put('/repartidor/:id',updateUserDto, actualizarUsuario);
appUsuario.put('/cliente/:id',updateUserDto, actualizarUsuario);
appUsuario.get('/cliente/pedidos/:id', verPedidosRealizadosUsuario);
appUsuario.get('/repartidor/entregas/:id', obtenerOrdenesPorRepartidor);
appUsuario.put('/cliente/pedidos/:id',orderDtoUpdate, actualizarOrden);
appUsuario.post('/cliente/pedido',orderDto, crearOrden);
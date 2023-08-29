import { Router } from "express";
import { orderDto, orderDtoUpdate } from "../storage/orden.dto.js";
import { updateUserDto } from "../storage/user.dto.js";
import { actualizarOrden,actualizarUsuario,crearOrden,obtenerInfoUsuario,obtenerOrdenesPorRepartidor,verPedidosRealizadosUsuario } from "../versions/users_version/user_actions.js";

const user = Router();

user.get('/cliente/:id',obtenerInfoUsuario );
user.get('/repartidor/:id',obtenerInfoUsuario)
user.put('/repartidor/:id',updateUserDto,actualizarUsuario)
user.put('/cliente/:id',updateUserDto,actualizarUsuario)
user.get('/cliente/pedidos/:id',verPedidosRealizadosUsuario)
user.get('/repartidor/entregas/:id',obtenerOrdenesPorRepartidor)
user.put('/cliente/pedidos/:id',orderDtoUpdate,actualizarOrden)
user.post('/cliente/pedido',orderDto,crearOrden)
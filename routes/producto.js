import { Router } from "express";
import { productsDto, productsDtoUpdate } from "../storage/products.dto.js";
import { getAllProducts, createProduct, updateProducto, deleteProducto, getAllProductsWithOutCategory, getAllProductsWithOutAviality } from "../versions/product_admin_version/product_actions.js";

export const appProducto = Router();

appProducto.get("/",getAllProducts);

appProducto.post('/', productsDto, createProduct)

appProducto.put('/:id', productsDtoUpdate, updateProducto)

appProducto.delete('/:id', deleteProducto)

appProducto.get('/:categoria', getAllProductsWithOutCategory)

appProducto.get('/disponibles', getAllProductsWithOutAviality)



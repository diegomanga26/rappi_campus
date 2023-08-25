import { Router } from "express";
import { productsDto, productsDtoUpdate } from "../storage/products.dto.js";
import { getAllProducts, createProduct, updateProducto, deleteProducto, getAllProductsWithOutCategory, getAllProductsWithOutAviality } from "../versions/product_admin_version/product_actions.js";

export const products = Router();

products.get("/", getAllProducts);

products.post('/', productsDto, createProduct)

products.put('/:id', productsDtoUpdate, updateProducto)

products.delete('/:id', deleteProducto)

products.get('/:categoria', getAllProductsWithOutCategory)

products.get('/disponibles', getAllProductsWithOutAviality)



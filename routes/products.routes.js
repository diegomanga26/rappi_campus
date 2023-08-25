import { Router } from "express";
import { productsDto } from "../storage/products.dto.js";
import { getAllProducts } from "../versions/product_admin_version/product_actions.js";

export const products = Router();

products.get("/", getAllProducts);

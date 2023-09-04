import { Router } from "express";
import { productsDto, productsDtoUpdate } from "../storage/products.dto.js";
import routesVersioning from "express-routes-versioning";
import {
  getAllProducts,
  createProduct,
  updateProducto,
  deleteProducto,
  getAllProductsWithOutCategory,
  getAllProductsWithOutAviality,
} from "../versions/product_admin_version/product_actions.js";
import { tokenValidate } from "../middlewares/JWT.js";
import { limitGrt } from "../middlewares/limiter.js";

const version = routesVersioning();

const appProducto = Router();
appProducto.use(tokenValidate, limitGrt());

appProducto.get(
  "/",
  version({
    "3.0.0": getAllProducts,
  })
);

appProducto.post(
  "/",
  productsDto,
  version({
    "2.0.0": createProduct,
  })
);

appProducto.put(
  "/:id",
  productsDtoUpdate,
  version({
    "2.0.0": updateProducto,
  })
);

appProducto.delete(
  "/:id",
  version({
    "1.0.0": deleteProducto,
  })
);

appProducto.get(
  "/categoria/:categoria",
  version({
    "3.0.0": getAllProductsWithOutCategory,
  })
);

appProducto.get(
  "/disponibles",
  version({
    "3.0.0": getAllProductsWithOutAviality,
  })
);

export default appProducto;
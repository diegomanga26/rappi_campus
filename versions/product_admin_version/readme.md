## Funciones

### `transformObject(inputObject)`

Esta función se utiliza para transformar las claves de un objeto según un mapeo predefinido.

- **Entrada:** Un objeto con propiedades que pueden incluir `name`, `description`, `price`, `category` y `availability`.
- **Salida:** Un nuevo objeto con las claves transformadas según el mapeo.

```javascript
function transformObject(inputObject) {
  // Definición del mapeo y creación del objeto transformado
  const keyMapping = {
    'name': 'nombre_producto',
    'description': 'descripcion',
    'price': 'precio',
    'category': 'categoria',
    'availability': 'disponibilidad',
  };
  const transformedObject = {};

  // Iteración sobre las claves del objeto de entrada
  for (const key in inputObject) {
    if (inputObject.hasOwnProperty(key)) {
      transformedObject[keyMapping[key] || key] = inputObject[key];
    }
  }

  // Devolución del objeto transformado
  return transformedObject;
}
```

### `getAllProducts(req, res)`

Esta función obtiene todos los productos de la base de datos.

- **Requerimientos:** `req` debe incluir un objeto `rateLimit` para controlar el límite de tasa de peticiones.
- **Respuesta:** Devuelve un arreglo de objetos que representan los productos.

```javascript
// Fragmento de código
export async function getAllProducts(req, res) {
  if (!req.rateLimit) return; // Control de tasa

  // Validación de errores y consulta a la base de datos
  try {
    const db = await con();
    const result = await db.collection("productos").find().toArray();
    res.status(200).json(result);
  } catch (error) {
    // Manejo de errores
  }
}
```

### `createProduct(req, res)`

Esta función crea un nuevo producto en la base de datos.

- **Requerimientos:** `req` debe incluir los datos del nuevo producto en el cuerpo de la solicitud.
- **Respuesta:** Devuelve el resultado de la inserción en la base de datos.

```javascript
// Fragmento de código
export async function createProduct(req, res) {
  if (!req.rateLimit) return; // Control de tasa

  // Validación de errores y extracción de datos
  try {
    const db = await con();
    const result = await db.collection("productos").insertOne(json);
    res.status(200).json(result);
  } catch (error) {
    // Manejo de errores
  }
}
```

### `updateProducto(req, res)`

Esta función actualiza un producto existente en la base de datos.

- **Requerimientos:** `req` debe incluir los datos actualizados del producto en el cuerpo de la solicitud y el ID del producto en los parámetros de la URL.
- **Respuesta:** Devuelve el resultado de la actualización en la base de datos.

```javascript
// Fragmento de código
export async function updateProducto(req, res) {
  if (!req.rateLimit) return; // Control de tasa

  // Validación de errores y transformación de claves
  try {
    const db = await con();
    const result = await db.collection("productos").updateOne(filter, { $set: json });
    res.status(200).json(result);
  } catch (error) {
    // Manejo de errores
  }
}
```

### `deleteProducto(req, res)`

Esta función elimina un producto de la base de datos.

- **Requerimientos:** `req` debe incluir el ID del producto en los parámetros de la URL.
- **Respuesta:** Devuelve el resultado de la eliminación en la base de datos.

```javascript
// Fragmento de código
export async function deleteProducto(req, res) {
  if (!req.rateLimit) return; // Control de tasa

  // Validación de errores y eliminación del producto
  try {
    const db = await con();
    const result = await db.collection("productos").updateOne(filter);
    res.status(200).json(result);
  } catch (error) {
    // Manejo de errores
  }
}
```

### `getAllProductsWithOutCategory(req, res)`

Esta función obtiene todos los productos de una categoría específica.

- **Requerimientos:** `req` debe incluir un objeto `rateLimit` para controlar el límite de tasa de peticiones y el nombre de la categoría en los parámetros de la URL.
- **Respuesta:** Devuelve un arreglo de objetos que representan los productos de la categoría especificada.

```javascript
// Fragmento de código
export async function getAllProductsWithOutCategory(req, res) {
  if (!req.rateLimit) return; // Control de tasa

  // Validación de errores y consulta a la base de datos
  try {
    const db = await con();
    const result = await db.collection("productos").find({ categoria: req.params.categoria }).toArray();
    res.status(200).json(result);
  } catch (error) {
    // Manejo de errores
  }
}
```

### `getAllProductsWithOutAviality(req, res)`

Esta función obtiene todos los productos disponibles.

- **Requerimientos:** `req` debe incluir un objeto `rateLimit` para controlar el límite de tasa de peticiones.
- **Respuesta:** Devuelve un arreglo de objetos que representan los productos disponibles.

```javascript
// Fragmento de código
export async function getAllProductsWithOutAviality(req, res) {
  if (!req.rateLimit) return; // Control de tasa

  // Validación de errores y consulta a la base de datos
  try {
    const db = await con();
    const result = await db.collection("productos").find({ disponibilidad: true }).toArray();
    res.status(200).json(result);
  } catch (error) {
    // Manejo de errores
  }
}
```

## Funciones

### `siguienteId(coleccion)`

Esta función asincrónica se utiliza para obtener el siguiente ID de una colección.

- **Entrada:** El nombre de la colección para la cual se desea obtener el siguiente ID.
- **Salida:** El siguiente ID disponible.

```javascript
// Fragmento de código
export async function siguienteId(coleccion) {
  const db = await con();
  const sequenceDocument = await db.collection("counters").findOneAndUpdate(
    { id: `${coleccion}Id` },
    { $inc: { sequence_value: 1 } },
    { returnDocument: "after" }
  );
  return await sequenceDocument.value.sequence_value;
}
```

### `registerUsuario(req, res)`

Esta función registra un nuevo usuario en la base de datos.

- **Requerimientos:** `req` debe incluir los datos del nuevo usuario en el cuerpo de la solicitud.
- **Respuesta:** Devuelve un mensaje de éxito si el registro fue exitoso.

```javascript
// Fragmento de código
export async function registerUsuario(req, res) {
  if (!req.rateLimit) return; // Control de tasa

  // Validación de errores y extracción de datos
  try {
    const db = await con();
    await db.collection("usuario").insertOne(json);
    res.status(201).send("success");
  } catch (error) {
    // Manejo de errores
  }
}
```

### `loginUsuario(req, res)`

Esta función permite que un usuario inicie sesión en la API.

- **Requerimientos:** `req` debe incluir los datos de inicio de sesión (correo y contraseña) en el cuerpo de la solicitud.
- **Respuesta:** Si se encuentra el usuario, devuelve un mensaje de éxito junto con los datos del usuario. Si no se encuentra, devuelve un mensaje de error.

```javascript
// Fragmento de código
export async function loginUsuario(req, res) {
  if (!req.rateLimit) return; // Control de tasa

  // Validación de errores y autenticación
  try {
    const db = await con();
    const user = await db.collection("usuario").findOne({ correo: Mail, contrasena: Password });
    if (user) {
      res.status(200).json({ message: "success", user });
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    // Manejo de errores
  }
}
```

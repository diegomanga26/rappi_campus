import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

// Configuración del archivo .env
dotenv.config({ path: "../" });

/**
 * Establece una conexión asincrónica con la base de datos.
 * @returns {Promise<Db>} Instancia de la base de datos conectada.
 */
export async function con() {
  try {
    const uri = "mongodb+srv://root:Oscar3004@cluster0.xvxpcpw.mongodb.net/rappi_prueba"; // Obtiene la cadena de conexión desde el archivo .env
    const client = await MongoClient.connect(uri); // Conecta al cliente de MongoDB utilizando la cadena de conexión
    return client.db(); // Devuelve la instancia de la base de datos conectada
  } catch (error) {
    return { status: 500, message: error.message }; // Captura y maneja errores de conexión
  }
}

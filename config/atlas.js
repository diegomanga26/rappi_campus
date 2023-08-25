import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

// Configuración del archivo .env
dotenv.config({ path: "../" });

// Función asincrónica para establecer una conexión con la base de datos
export async function con() {
  try {
    const uri = process.env.ATLAS_STRCONNECT; // Obtiene la cadena de conexión desde el archivo .env
    const client = await MongoClient.connect(uri); // Conecta al cliente de MongoDB utilizando la cadena de conexión
    return client.db(); // Devuelve la instancia de la base de datos conectada
  } catch (error) {
    return { status: 500, message: error.message }; // Captura y maneja errores de conexión
  }
}

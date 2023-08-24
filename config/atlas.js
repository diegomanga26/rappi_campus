import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: "../" });

export async function con() {
  try {
    const uri = process.env.ATLAS_STRCONNECT;
    const client = await MongoClient.connect(uri);
    return client.db();
  } catch (error) {
    return { status: 500, message: error.message };
  }
}
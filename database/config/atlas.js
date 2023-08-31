import {MongoClient} from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();
export async function con(){
    try {
        const uri = "mongodb+srv://root:Oscar3004@cluster0.xvxpcpw.mongodb.net/rappi_prueba"
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        const client = await MongoClient.connect(uri, options);
        return client.db();
    } catch (error) {
        return {status: 500, message: error};
    }
};
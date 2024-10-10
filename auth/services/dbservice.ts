import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

export const collections: { auth?: mongoDB.Collection } = {}

export async function connectToDatabase () {
    dotenv.config();
 
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING!);
            
    await client.connect();
        
    const db: mongoDB.Db = client.db(process.env.DB_NAME);
   
    const authCollection: mongoDB.Collection = db.collection(process.env.AUTH_COLLECTION_NAME!);

    collections.auth = authCollection;
    
    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${authCollection.collectionName}`);
    console.log(`waiting for localhost...`);
 }
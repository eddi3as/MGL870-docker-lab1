import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

export const collections: { fontaines?: mongoDB.Collection } = {}

export async function connectToDatabase () {
    dotenv.config();
 
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING);
            
    await client.connect();
        
    const db: mongoDB.Db = client.db(process.env.DB_NAME);

    const fontaineCollection: mongoDB.Collection = db.collection(process.env.FNT_COLLECTION_NAME);

    collections.fontaines = fontaineCollection;
    
    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${fontaineCollection.collectionName}`);
    console.log(`waiting for localhost...`);
 }
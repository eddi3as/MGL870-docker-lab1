import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

export const collections: { pointsinteret?: mongoDB.Collection } = {}

export async function connectToDatabase () {
    dotenv.config();
 
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING);
            
    await client.connect();
        
    const db: mongoDB.Db = client.db(process.env.DB_NAME);
   
    const pointsinteretCollection: mongoDB.Collection = db.collection(process.env.POINTSINTERET_COLLECTION_NAME);

    collections.pointsinteret = pointsinteretCollection;
    
    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${pointsinteretCollection.collectionName}`);
    console.log(`waiting for localhost...`);
 }
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

export const collections: { stats?: mongoDB.Collection,
                            compteurs? : mongoDB.Collection} = {}

export async function connectToDatabase () {
    dotenv.config();
 
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING);
            
    await client.connect();
        
    const db: mongoDB.Db = client.db(process.env.DB_NAME);
   
    const statsCollection: mongoDB.Collection = db.collection(process.env.STATS_COLLECTION_NAME);
    const compteurCollection: mongoDB.Collection = db.collection(process.env.CNT_COLLECTION_NAME);

    collections.stats = statsCollection;
    collections.compteurs = compteurCollection;
    
    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${statsCollection.collectionName}`);
    console.log(`waiting for localhost...`);
 }
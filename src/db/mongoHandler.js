import { MongoClient } from "mongodb";

export const pushToMongoDB = async (config, collectionName, data) => {
  const client = new MongoClient(config.uri);
  try {
    console.log(`Pushing data to MongoDB collection: ${collectionName}`);
    await client.connect();
    const db = client.db(config.dbName);
    const collection = db.collection(collectionName);

    await collection.insertMany(data);
  } catch (error) {
    console.error("Error inserting data into MongoDB:", error);
    throw error;
  } finally {
    await client.close();
  }
};

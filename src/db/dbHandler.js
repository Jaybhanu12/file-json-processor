import { pushToMySQL } from "./mysqlHandler.js";
import { pushToMongoDB } from "./mongoHandler.js";

export const dbPushHandler = async (dbType, dbConfig, collectionName, data, customHandler) => {
  if (customHandler) {
    return await customHandler(dbConfig, collectionName, data);
  }

  switch (dbType.toLowerCase()) {
    case "mysql":
      return await pushToMySQL(dbConfig, collectionName, data);
    case "mongodb":
      return await pushToMongoDB(dbConfig, collectionName, data);
    default:
      throw new Error(`Unsupported database type: ${dbType}`);
  }
};

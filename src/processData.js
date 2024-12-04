import { dbPushHandler } from "./db/dbHandler.js";
import { ReadFileData, ReadFileHeader } from "./file/fileReader.js";
import { moveFile } from "./file/fileUtil.js";
import { inferSchemaFromJson } from "./utils/schemaUtils.js";
import { convertToType } from "./utils/typeUtil.js";

export const processData = async ({
  dbType,
  dbConfig,
  filePath,
  jsonData,
  collectionName,
  customHandler,
  outputFolder,
}) => {
  try {
    if (filePath) {
      // Handle file input
      await processFileData(
        dbType,
        dbConfig,
        filePath,
        collectionName,
        customHandler,
        outputFolder
      );
    }

    if (jsonData) {
      // Handle JSON input
      await processJsonData(
        dbType,
        dbConfig,
        jsonData,
        collectionName,
        customHandler
      );
    }
  } catch (error) {
    console.error("Error processing data:", error);
  }
  // Function to process CSV file data
};

const processFileData = async (
  dbType,
  dbConfig,
  filePath,
  collectionName,
  customHandler,
  outputFolder
) => {
  console.log(`Processing CSV file: ${filePath}`);

  const { schema, delimiterSequence, isSingleDelimiter } =
    await ReadFileHeader(filePath);
  const data = await ReadFileData(
    filePath,
    schema,
    delimiterSequence,
    isSingleDelimiter
  );

  await dbPushHandler(dbType, dbConfig, collectionName, data, customHandler);

  if (outputFolder) {
    await moveFile(filePath, outputFolder);
  }
};

// Function to process JSON data
const processJsonData = async (
  dbType,
  dbConfig,
  jsonData,
  collectionName,
  customHandler
) => {
  // console.log("Processing JSON data:", jsonData);

  if (!Array.isArray(jsonData) || jsonData.length === 0) {
    throw new Error("JSON data must be an array of objects.");
  }

  // Infer schema from the first data item (first object in the array)
  const schema = inferSchemaFromJson(jsonData);

  // Convert the data to match the schema (including type conversion)
  const processedData = jsonData.map((item) => {
    const row = {};
    schema.forEach((field) => {
      const value = item[field.name];
      row[field.name] = convertToType(value, field.type); // Convert based on inferred type
    });
    return row;
  });

  // Push processed data to DB
  await dbPushHandler(
    dbType,
    dbConfig,
    collectionName,
    processedData,
    customHandler
  );
};
# File JSON Processor

`@jaybhanushali01/file-json-processor` is a dynamic utility package automates the process of reading data from a file (CSV, TXT, etc.) or a JSON object, dynamically generating a schema with accurate data types, and optionally pushing that data to a MySQL or MongoDB database. The package includes default logic for inserting data into MySQL and MongoDB, but it also allows developers to define their own custom database handler functions for more flexible data handling.

## Features

- **Automatic Schema Generation:** Automatically infers the data type for each field (string, number, date, etc.).
- **Customizable Database Handling:** You can use the default MySQL and MongoDB logic or provide your own custom database handler.
- **Supports File and JSON Data:** Process any files or JSON data based on the parameters provided.
- **Flexible Output Options:** If you are processing a file, you can specify an output folder to move the file after processing.


## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
   - [Processing JSON Data](#processing-json-data)
   - [Processing File Data](#processing-file-data)
3. [Parameters](#parameters)
4. [Database Integration](#database-integration)
5. [Author & Copyright](#author-copyright)

## Installation

To install the package, run the following command:

```bash
npm install @jaybhanushali01/file-json-processor
```

## Usage
This package processes both JSON and file data, and supports MySQL and MongoDB integration. You can either use the default database logic or provide custom handlers.

## Processing JSON Data
When processing JSON data, you need to pass the JSON object along with the necessary database configuration and other parameters.

## Processing File Data
When processing file data (e.g., CSV or plain text file), pass the file path along with other necessary parameters.

```javascript
import { processData } from "@jaybhanushali01/file-json-processor";
import mysql from "mysql2";
import { MongoClient } from "mongodb";

// Sample JSON data
const jsonData = [
  { name: "John", age: 30, dateOfBirth: "1994-12-05" },
  { name: "Jane", age: 28, dateOfBirth: "1996-08-21" },
];

// MySQL configuration
const mysqlConfig = {
  host: "127.0.0.1",
  user: "root",
  password: "yourpassword",
  database: "my_database",
  port: 3306,
};

// MongoDB configuration
const mongoConfig = {
  uri: "mongodb://localhost:27017",
  dbName: "my_database",
};

// Custom MySQL handler (example)
const customMySQLHandler = async (dbConfig, collectionName, data) => {
  console.log("Custom MySQL logic: Processing data.");
  const connection = mysql.createConnection(dbConfig);
  const tableName = collectionName;
  data.forEach((item) => {
    console.log(`Inserting ${JSON.stringify(item)} into ${tableName}`);
    // Custom processing logic here
  });
  connection.end();
};

// Custom MongoDB handler (example)
const customMongoHandler = async (dbConfig, collectionName, data) => {
  console.log("Custom MongoDB logic: Processing data.");
  const client = new MongoClient(dbConfig.uri);
  await client.connect();
  console.log(data);
  console.log(`Connected to MongoDB: ${dbConfig.dbName}, Collection: ${collectionName}`);
  // Custom processing logic here
  await client.close();
};

// Processing JSON data for MySQL
processData({
  dbType: "mysql",
  dbConfig: mysqlConfig,
  filePath: false,  // No file path in this case
  jsonData: jsonData, // JSON data to be processed
  customHandler: customMySQLHandler,  // Custom MySQL handler (optional)
  collectionName: "jsondata",
});

// Processing file data for MongoDB
const filePath = "./path/to/your/file.txt"; // Path to the file (.csv,.txt,etc)
processData({
  dbType: "mongodb",
  dbConfig: mongoConfig,
  filePath: filePath,  // file path
  jsonData: false,  // No JSON data in this case
  collectionName: "filedata",
  // customHandler: customMongoHandler, // Custom MongoDB handler (optional)
  outputFolder: "./done",  // Output folder for file (optional)
});
```

## Parameters
## Required Parameters

dbType (string): The type of database to use. Can be "mysql" or "mongodb".
dbConfig (object): Database connection configuration for MySQL or MongoDB.
For MySQL: { host, user, password, database, port }
For MongoDB: { uri, dbName }
filePath (string | false): Path to the file to be processed (e.g., CSV file). Set to false if you're processing JSON data.
jsonData (array | false): The JSON data to be processed. Set to false if you're processing file data.
collectionName (string): The name of the collection or table in the database.
customHandler (function | null): A custom handler function to process the data in the database. If null, the default database logic will be used.
outputFolder (string | null): Optional. Path to move the file after processing. Will be used if filePath is provided.

## Database Integration
The package supports integration with both MySQL and MongoDB. By default, the package will push data to the specified database using default logic. If a custom handler is provided, it will override the default logic.

## MySQL Integration
The package supports inserting data into a MySQL database by establishing a connection using the provided dbConfig and inserting data into the specified table.

## MongoDB Integration
The package supports inserting data into a MongoDB collection using the provided dbConfig. The MongoDB connection is established using the MongoClient from the mongodb package.

## Author & Copyright
**Author**: Jay Bhanushali
**Copyright**: 2024, Jay Bhanushali. All rights reserved.
import mysql from "mysql2/promise";

export const pushToMySQL = async (dbConfig, collectionName, data) => {
  let connection; // Declare the connection variable in the broader scope
  try {
    // create a connection without specifying the database
    const { database, ...connectionConfig } = dbConfig;
    connection = await mysql.createConnection(connectionConfig);

    // ensure database exists
    const createDBQuery = `CREATE DATABASE IF NOT EXISTS \`${database}\``;
    await connection.query(createDBQuery);
    // console.log(`Database '${database}' ensured.`);

    // Switch connection to the target database
    await connection.changeUser({ database });

    const tableName = collectionName || "default_table"; // Use provided name or a default name
    const columns = Object.keys(data[0])
      .map((col) => `\`${col}\` VARCHAR(255)`) // Define columns dynamically
      .join(", ");

    // Create table if it doesn't exist
    const createTableQuery = `CREATE TABLE IF NOT EXISTS \`${tableName}\` (${columns})`;
    await connection.query(createTableQuery);
    // console.log(`Table '${tableName}' ensured in MySQL.`);

    // Dynamically truncate fields if data exceeds sql default max length...
    const maxLength = 255;
    data = data.map((row) => {
      const truncatedRow = {};
      for (const [key, value] of Object.entries(row)) {
        if (typeof value === "string" && value.length > maxLength) {
          truncatedRow[key] = value.slice(0, maxLength);
        } else {
          truncatedRow[key] = value;
        }
      }
      return truncatedRow;
    });

    const placeholders = data
      .map(
        () =>
          `(${Object.keys(data[0])
            .map(() => "?")
            .join(", ")})`
      )
      .join(", ");

    const values = data.flatMap((item) => Object.values(item)); // Flatten data values for placeholders
    const insertQuery = `INSERT INTO \`${tableName}\` (${Object.keys(data[0])
      .map((col) => `\`${col}\``)
      .join(", ")}) VALUES ${placeholders}`;
    await connection.query(insertQuery, values);
    console.log("Data inserted into MySQL successfully.");
  } catch (error) {
    console.error("Error in MySQL operation:", error);
  } finally {
    // Close the connection if established
    if (connection) {
      await connection.end();
      console.log("Connection closed.");
    }
  }
};

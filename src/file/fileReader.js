import fs from "fs";
import {
  detectDelimiterWithNLP,
  splitRowByDelimiters,
} from "../utils/schemaUtils.js";
import { convertToType, detectFieldType } from "../utils/typeUtil.js";

// Read the file header and return schema
export const ReadFileHeader = async (filePath) => {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const lines = fileContent.split("\n").map((line) => line.trim());

  if (lines.length < 2) {
    throw new Error("File must contain at least two lines (header and data).");
  }

  const { delimiter, isSingleDelimiter } = detectDelimiterWithNLP(lines[0]);

  const rawHeader = splitRowByDelimiters(
    lines[0],
    delimiter,
    isSingleDelimiter
  );
  const sampleData = splitRowByDelimiters(
    lines[1],
    delimiter,
    isSingleDelimiter
  );

  const schema = rawHeader.map((fieldName, index) => ({
    name: fieldName,
    type: detectFieldType(
      sampleData[index] ? sampleData[index].trim() : "",
      true
    ),
  }));

  return { schema, delimiterSequence: delimiter, isSingleDelimiter };
};
// Read file data based on schema
export const ReadFileData = async (
  filePath,
  schema,
  delimiterSequence,
  isSingleDelimiter
) => {
  return new Promise((resolve, reject) => {
    const data = [];
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const lines = fileContent.split("\n");

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) {
        continue;
      }
      const parts = splitRowByDelimiters(
        lines[i],
        delimiterSequence,
        isSingleDelimiter
      );
      const row = {};

      schema.forEach((field, index) => {
        if (index < parts.length) {
          const value = parts[index];
          row[field.name] = convertToType(value, field.type);
        }
      });

      data.push(row);
    }
    resolve(data);
  });
};

  
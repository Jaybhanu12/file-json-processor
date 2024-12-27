import { detectFieldType } from "./typeUtil.js";

// infer schema from JSON data
export const inferSchemaFromJson = (jsonData) => {
  const schema = [];

  // Infer type from the first object in the JSON array
  const firstItem = jsonData[0];

  Object.keys(firstItem).forEach((fieldName) => {
    const fieldValue = firstItem[fieldName];
    const fieldType = detectFieldType(fieldValue, false);
    schema.push({ name: fieldName, type: fieldType });
  });

  return schema;
};
// Detect field type 
export const detectDelimiterWithNLP = (headerLine) => {
  const delimiterPatterns = headerLine.match(/ {4}|:|;|,|\||\t/g) || [];
  const uniqueDelimiters = [...new Set(delimiterPatterns)];

  if (uniqueDelimiters.length === 1) {
    // console.log("Single Delimiter Detected:", uniqueDelimiters[0]);
    return { delimiter: uniqueDelimiters[0], isSingleDelimiter: true };
  }

  const uniqueSequence = uniqueDelimiters.map((delimiter) =>
    delimiter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );
  // console.log("Detected Delimiters Sequence:", uniqueSequence);
  return { delimiter: uniqueSequence, isSingleDelimiter: false };
};
// splitrow using dynamic delimiter
export const splitRowByDelimiters = (
  row,
  delimiterSequence,
  isSingleDelimiter
) => {
  if (isSingleDelimiter) {
    return row
      .split(new RegExp(delimiterSequence, "g"))
      .map((part) => part.trim());
  }

  const result = [];
  let remaining = row;
  delimiterSequence.forEach((delimiter) => {
    const parts = remaining.split(new RegExp(delimiter, "g"));
    if (parts.length > 1) {
      result.push(parts.shift().trim());
      remaining = parts.join(delimiter).trim();
    } else {
      result.push(""); // Empty field if delimiter is missing
    }
  });

  result.push(remaining.trim()); // Add the final part
  return result;
};

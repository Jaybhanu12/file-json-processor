// Detect field type based on data
export const detectFieldType = (sampleValue, filePath) => {
  let trimmedValue = "";
  if (filePath) {
    trimmedValue = sampleValue.replace(/"/g, "").trim();
  } else {
    trimmedValue = (sampleValue || "").toString().trim();
  }

  if (/^-?\d+(\.\d+)?$/.test(trimmedValue)) {
    return trimmedValue.includes(".") ? "Float" : "Number";
  } else if (isDate(trimmedValue)) {
    return "Date";
  } else {
    return "String";
  }
};

// Check a valid date
const isDate = (value) => {
  const date = new Date(value);
  return !isNaN(date.getTime());
};

// Convert the value based on its type
export const convertToType = (value, type) => {
  // Ensure value is a string before calling replace (handle non-string types)
  const stringValue = (value || "").toString().trim();

  if (type === "Number" || type === "Float") {
    // Handle comma-separated values (e.g., "1,000") and parse the number
    return parseFloat(stringValue.replace(/,/g, "")) || null; // Returns null if the value cannot be parsed
  } else if (type === "Date") {
    // Parse as a Date, return null if invalid date
    return isDate(stringValue) ? new Date(stringValue) : null;
  } else {
    // For string type, remove quotes and extra spaces
    return stringValue.replace(/^"|"$/g, "").trim();
  }
};

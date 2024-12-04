import fs from "fs";
import path from "path";

export const moveFile = async (fileName, destinationFolder) => {
  try {
    const newFilePath = path.join(destinationFolder, path.basename(fileName));
    fs.renameSync(fileName, newFilePath);
  } catch (error) {
    console.error(`Error moving file: ${error.message}`);
  }
};

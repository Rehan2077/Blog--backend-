import fs from 'fs/promises';
import path from 'path';

export const fileRemover = async (fileToRemove = "") => {
  const folderPath = './uploads';
  try {
    if (fileToRemove) {
      const filePathToRemove = path.join(folderPath, fileToRemove);
      await fs.unlink(filePathToRemove);
      console.log(`File '${fileToRemove}' removed successfully.`);
    } else {
      console.log('No file specified to keep. No files were removed.');
    }
  } catch (error) {
    console.error('Error deleting file:', error.message);
  }
};

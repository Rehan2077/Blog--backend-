import fs from 'fs/promises';
import path from 'path';

export const fileRemover = async(fileToKeep="") => {
  const folderPath = './uploads'
  try {
    const files = await fs.readdir(folderPath);

    for (const file of files) {
      if (file !== fileToKeep) {
        const filePath = path.join(folderPath, file);
        await fs.unlink(filePath);
      }
    }
  } catch (error) {
    console.error('Error deleting files:', error.message);
  }
}
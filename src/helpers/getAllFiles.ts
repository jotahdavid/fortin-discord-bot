import path from 'path';
import fs from 'fs';

export function getAllFiles(dirPath: string, arrayOfFiles: string[] | null = null) {
  const files = fs.readdirSync(dirPath);

  let result = arrayOfFiles ? [...arrayOfFiles] : [];

  files.forEach((file) => {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      result = getAllFiles(path.join(dirPath, file), result);
    } else {
      result.push(path.join(dirPath, file));
    }
  });

  return result;
}

import multer from 'multer';
import path from 'path';
import config from './config';
import { promises as fs } from 'node:fs';
import { randomUUID } from 'node:crypto';

const imageStorage = multer.diskStorage({
  destination: async (_, __, callback) => {
    const destDir = path.join(config.publicPath, 'images');
    await fs.mkdir(destDir, { recursive: true });
    callback(null, config.publicPath);
  },
  filename: (_, file, callback) => {
    const extension = path.extname(file.originalname);
    const newFileName = randomUUID() + extension;
    callback(null, 'images/' + newFileName);
  },
});

export const imageUpload = multer({ storage: imageStorage });

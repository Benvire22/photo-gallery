import path from 'path';
import { CorsOptions } from 'cors';
import { configDotenv } from 'dotenv';

configDotenv();

const rootPath = __dirname;

const whiteList: string[] = ['http://localhost:5173'];
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || whiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

const config = {
  rootPath,
  corsOptions,
  publicPath: path.join(rootPath, 'public'),
  database: 'mongodb://localhost/music-app',
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  apiUrl: 'http://localhost:8000/',
};

export default config;

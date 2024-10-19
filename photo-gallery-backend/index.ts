import express from 'express';
import cors from 'cors';
import config from './config';
import mongoose from 'mongoose';
import usersRouter from './routers/users';
import photosRouter from "./routers/photos";

const app = express();
const port = 8000;

app.use(cors(config.corsOptions));

app.use(express.json());
app.use(express.static('public'));

app.use('/users', usersRouter);
app.use('/photos', photosRouter);

const run = async () => {
  await mongoose.connect(config.database);

  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });

  process.on('exit', () => {
    mongoose.disconnect();
  });
};

void run().catch(console.error);

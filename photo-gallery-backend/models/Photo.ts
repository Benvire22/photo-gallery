import mongoose, { Types } from 'mongoose';
import User from './User';
import { IPhoto, PhotoModel } from '../types';

const Schema = mongoose.Schema;

const PhotoSchema = new Schema<IPhoto, PhotoModel>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async (value: Types.ObjectId) => {
        const user = await User.findById(value);
        return Boolean(user);
      },
      message: 'User not found',
    },
  },
  title: {
    required: true,
    type: String,
  },
  image: {
    required: true,
    type: String,
  },
});

const Photo = mongoose.model<IPhoto, PhotoModel>('Photo', PhotoSchema);
export default Photo;
import mongoose, { Model } from 'mongoose';

export interface UserFields {
  email: string;
  password: string;
  displayName: string;
  token: string;
  role: string;
  googleID?: string;
}

export interface IPhoto {
  user: mongoose.Types.ObjectId | string;
  title: string;
  image: string;
}

export type PhotoModel = Model<IPhoto>;

export interface UserMethods {
  checkPassword(password: string): Promise<boolean>;
  generateToken(): void;
}

export type UserModel = Model<UserFields, {}, UserMethods>;
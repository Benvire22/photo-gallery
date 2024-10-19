import { Model } from 'mongoose';

export interface UserFields {
  email: string;
  password: string;
  displayName: string;
  token: string;
  role: string;
  googleID?: string;
}

export interface UserMethods {
  checkPassword(password: string): Promise<boolean>;
  generateToken(): void;
}

export type UserModel = Model<UserFields, {}, UserMethods>;
import { NextFunction, Request, Response } from 'express';
import { HydratedDocument } from 'mongoose';
import { UserFields, UserMethods } from '../types';
import User from '../models/User';


export interface RequestWithUser extends Request {
  user?: HydratedDocument<UserFields, UserMethods> | null;
}

const authSimple = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const headerValue = req.get('Authorization');

  if (headerValue) {
    const [_bearer, token] = headerValue.split(' ');

    if (token) {
      req.user = await User.findOne({ token });
    }
  }

  return next();
};

export default authSimple;
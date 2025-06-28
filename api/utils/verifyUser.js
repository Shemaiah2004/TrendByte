import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  if (!req.session.user) {
    return next(errorHandler(401, 'Unauthorized'));
  }
  
  req.user = req.session.user;
  next();
};
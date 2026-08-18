import jwt from 'jsonwebtoken';
import ApiResponse from '../utils/apiResponse.js';
import mongoose from 'mongoose';

export const verifyToken = (req, res, next) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return ApiResponse.error(res, 'No token provided', 401);
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    return next();
  } catch (err) {
    return ApiResponse.error(res, err.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'Invalid token', 401);
  }
};

export const protect = verifyToken;

export const requireRole = (...roles) => (req, res, next) => {
  const allowedRoles = Array.isArray(roles[0]) ? roles[0] : roles;
  if (!req.user) return ApiResponse.error(res, 'Unauthorized', 401);
  if (!allowedRoles.includes(req.user.role)) return ApiResponse.error(res, 'Forbidden access for this role', 403);
  next();
};

export const authorize = requireRole;

export const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export default { verifyToken, protect, requireRole, authorize, validateObjectId };

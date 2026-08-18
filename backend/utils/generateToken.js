import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const signAccessToken = (payload) => jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' });
export const signRefreshToken = (payload) => jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' });

export const hashToken = async (token) => bcrypt.hash(token, 12);

export default { signAccessToken, signRefreshToken, hashToken };

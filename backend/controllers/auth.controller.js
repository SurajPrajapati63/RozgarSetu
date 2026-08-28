import bcrypt from 'bcryptjs';
import User from '../models/User.model.js';
import Worker from '../models/Worker.model.js';
import Admin from '../models/Admin.model.js';
import ApiResponse from '../utils/apiResponse.js';
import { signAccessToken, signRefreshToken, hashToken } from '../utils/generateToken.js';
import { generateWorkerID } from '../utils/generateWorkerID.js';
import { resolveLoginTarget } from '../utils/authLoginResolver.js';

const isBcryptHash = (value = '') => typeof value === 'string' && /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(value);

const verifyPassword = async (candidatePassword, storedPassword) => {
  if (!storedPassword) return false;

  if (storedPassword === candidatePassword) return true;

  try {
    return await bcrypt.compare(candidatePassword, storedPassword);
  } catch {
    return false;
  }
};

export const userSignup = async (req, res) => {
  const { name, mobile, password, country, state, district, city, pincode } = req.body;
  if (await User.findOne({ mobile })) return ApiResponse.error(res, 'Mobile already registered', 409);
  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({ name, mobile, password: hashed, country, state, district, city, pincode });
  const payload = { id: user._id, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  user.refreshToken = await hashToken(refreshToken);
  user.lastLogin = new Date();
  await user.save();
  return ApiResponse.success(res, { accessToken, refreshToken, user: { id: user._id, name: user.name, mobile: user.mobile, role: user.role, photo: user.photo } }, 'Registered and authenticated');
};

export const userLogin = async (req, res) => {
  const { mobile, password } = req.body;
  console.debug(`[AUTH] userLogin attempt for mobile=${mobile}`);
  const user = await User.findOne({ mobile }).select('+password +refreshToken');
  if (!user) {
    console.debug(`[AUTH] userLogin: user not found for mobile=${mobile}`);
    return ApiResponse.error(res, 'Invalid credentials', 401);
  }
  const ok = await verifyPassword(password, user.password || '');
  console.debug(`[AUTH] userLogin: password verification result=${ok} for mobile=${mobile}`);
  if (!ok) {
    return ApiResponse.error(res, 'Invalid credentials', 401);
  }
  if (!isBcryptHash(user.password) && user.password === password) {
    user.password = await bcrypt.hash(password, 12);
    await user.save();
  }
  const payload = { id: user._id, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  user.refreshToken = await hashToken(refreshToken);
  user.lastLogin = new Date();
  await user.save();
  return ApiResponse.success(res, { accessToken, refreshToken, user: { id: user._id, name: user.name, mobile: user.mobile, role: user.role, photo: user.photo } }, 'Authenticated');
};

export const workerSignup = async (req, res) => {
  const { name, mobile, country, state, district, city, pincode, password } = req.body;
  if (await Worker.findOne({ mobile })) return ApiResponse.error(res, 'Mobile already registered', 409);
  const hashed = await bcrypt.hash(password, 12);
  const workerID = await generateWorkerID();
  const address = `${city}, ${district}, ${state}, ${country} - ${pincode}`;
  const worker = await Worker.create({ name, mobile, address, password: hashed, workerID, country, state, district, city, pincode });
  // send welcome email/sms (best-effort)
  return ApiResponse.success(res, { workerID }, 'Registration successful');
};

export const workerLogin = async (req, res) => {
  const { workerID, password } = req.body;
  const worker = await Worker.findOne({ workerID }).select('+password +refreshToken');
  if (!worker) return ApiResponse.error(res, 'Invalid credentials', 401);
  const ok = await verifyPassword(password, worker.password);
  if (!ok) return ApiResponse.error(res, 'Invalid credentials', 401);
  if (!isBcryptHash(worker.password) && worker.password === password) {
    worker.password = await bcrypt.hash(password, 12);
  }
  if (['suspended','rejected'].includes(worker.status)) return ApiResponse.error(res, 'Account not allowed', 403);
  const payload = { id: worker._id, role: worker.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  worker.refreshToken = await hashToken(refreshToken);
  worker.lastLogin = new Date();
  await worker.save();
  return ApiResponse.success(res, { accessToken, refreshToken, worker: { id: worker._id, name: worker.name, workerID: worker.workerID, role: worker.role, photo: worker.photo, status: worker.status, category: worker.category } }, 'Authenticated');
};

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL?.trim();
  const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD?.trim();

  let admin = await Admin.findOne({ email }).select('+password +refreshToken');

  if (!admin && defaultAdminEmail && email === defaultAdminEmail) {
    admin = await Admin.create({
      name: 'Super Admin',
      email: defaultAdminEmail,
      password: await bcrypt.hash(defaultAdminPassword || '', 12),
    });
  }

  if (!admin) return ApiResponse.error(res, 'Invalid credentials', 401);

  const ok = await verifyPassword(password, admin.password || '');
  if (!ok) return ApiResponse.error(res, 'Invalid credentials', 401);
  if (!isBcryptHash(admin.password) && admin.password === password) {
    admin.password = await bcrypt.hash(password, 12);
  }

  const payload = { id: admin._id, role: admin.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  admin.refreshToken = await hashToken(refreshToken);
  admin.lastLogin = new Date();
  await admin.save();
  // create audit log
  const Audit = (await import('../models/AuditLog.model.js')).default;
  await Audit.create({ admin: admin._id, action: 'ADMIN_LOGIN', ip: req.ip });
  return ApiResponse.success(res, { accessToken, refreshToken, admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } }, 'Authenticated');
};

export const login = async (req, res) => {
  const { identifier, password } = req.body;
  const target = resolveLoginTarget(identifier, password);

  if (target.type === 'worker') {
    req.body = { workerID: target.identifier, password };
    return workerLogin(req, res);
  }

  if (target.type === 'admin') {
    req.body = { email: target.identifier, password };
    return adminLogin(req, res);
  }

  req.body = { mobile: target.identifier, password };
  return userLogin(req, res);
};

export const refreshToken = async (req, res) => {
  const token = req.body.refreshToken || req.cookies?.refreshToken;
  if (!token) return ApiResponse.error(res, 'Refresh token required', 400);
  try {
    const decoded = await new Promise((resolve, reject) => {
      import('jsonwebtoken').then(({ default: jwt }) => jwt.verify(token, process.env.JWT_REFRESH_SECRET, (e, d) => e ? reject(e) : resolve(d)));
    });
    const { id, role } = decoded;
    const Model = role === 'worker' ? Worker : (role === 'admin' ? Admin : User);
    const user = await Model.findById(id).select('+refreshToken');
    if (!user) return ApiResponse.error(res, 'Invalid token', 401);
    const match = await bcrypt.compare(token, user.refreshToken || '');
    if (!match) return ApiResponse.error(res, 'Invalid token', 401);
    const payload = { id: user._id, role: user.role };
    const accessToken = signAccessToken(payload);
    const newRefresh = signRefreshToken(payload);
    user.refreshToken = await hashToken(newRefresh);
    await user.save();
    return ApiResponse.success(res, { accessToken, refreshToken: newRefresh }, 'Token rotated');
  } catch (err) {
    return ApiResponse.error(res, 'Invalid refresh token', 401);
  }
};

export const logout = async (req, res) => {
  const { id, role } = req.user || {};
  if (!id) return ApiResponse.error(res, 'Unauthorized', 401);
  const Model = role === 'worker' ? Worker : (role === 'admin' ? Admin : User);
  const user = await Model.findById(id);
  if (user) { user.refreshToken = null; await user.save(); }
  res.clearCookie('refreshToken');
  return ApiResponse.success(res, {}, 'Logged out successfully');
};

export default { userSignup, userLogin, workerSignup, workerLogin, adminLogin, login, refreshToken, logout };

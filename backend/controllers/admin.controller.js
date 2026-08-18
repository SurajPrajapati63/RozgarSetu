import Worker from '../models/Worker.model.js';
import User from '../models/User.model.js';
import Booking from '../models/Booking.model.js';
import Post from '../models/Post.model.js';
import Review from '../models/Review.model.js';
import Audit from '../models/AuditLog.model.js';
import ApiResponse from '../utils/apiResponse.js';
import { deleteFromCloudinary, deleteMultipleFromCloudinary } from '../utils/cloudinaryHelper.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const getStats = asyncHandler(async (req, res) => {
  const [totalWorkers, activeWorkers, pendingWorkers, totalUsers, totalBookings, revenueAgg] = await Promise.all([
    Worker.countDocuments(),
    Worker.countDocuments({ status: 'active' }),
    Worker.countDocuments({ status: 'pending' }),
    User.countDocuments(),
    Booking.countDocuments(),
    Booking.aggregate([{ $match: { status: 'completed' } }, { $group: { _id: null, total: { $sum: '$amount' } } }])
  ]);
  const totalRevenue = revenueAgg[0]?.total || 0;
  return ApiResponse.success(res, { totalWorkers, activeWorkers, pendingWorkers, totalUsers, totalBookings, totalRevenue });
});

export const getAllWorkers = asyncHandler(async (req, res) => {
  const { status, category, city, search, page = 1, limit = 12 } = req.query;
  const query = {};
  if (status && status !== 'all') query.status = status;
  if (category && category !== 'All') query.category = category;
  if (city) query.city = new RegExp(city, 'i');
  if (search) query.$or = [{ name: new RegExp(search, 'i') }, { workerID: new RegExp(search, 'i') }, { mobile: new RegExp(search, 'i') }];
  
  const skip = (Number(page) - 1) * Number(limit);
  const data = await Worker.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
  const total = await Worker.countDocuments(query);
  return ApiResponse.paginated(res, data, total, Number(page), Number(limit));
});

export const getPendingWorkers = asyncHandler(async (req, res) => {
  const workers = await Worker.find({ status: 'pending' }).sort({ createdAt: -1 });
  return ApiResponse.success(res, workers);
});

export const approveWorker = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const worker = await Worker.findById(id);
  if (!worker) return ApiResponse.error(res, 'Worker not found', 404);

  worker.status = 'active';
  await worker.save();

  await Audit.create({
    admin: req.user.id,
    action: 'APPROVE_WORKER',
    targetModel: 'Worker',
    targetId: worker._id,
    details: { workerID: worker.workerID, name: worker.name },
    ip: req.ip
  });

  return ApiResponse.success(res, worker, 'Worker approved successfully');
});

export const rejectWorker = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const worker = await Worker.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
  if (!worker) return ApiResponse.error(res, 'Worker not found', 404);

  await Audit.create({
    admin: req.user.id,
    action: 'REJECT_WORKER',
    targetModel: 'Worker',
    targetId: worker._id,
    details: { workerID: worker.workerID, name: worker.name },
    ip: req.ip
  });

  return ApiResponse.success(res, worker, 'Worker rejected');
});

export const suspendWorker = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const worker = await Worker.findById(id);
  if (!worker) return ApiResponse.error(res, 'Worker not found', 404);

  const nextStatus = worker.status === 'suspended' ? 'active' : 'suspended';
  worker.status = nextStatus;
  await worker.save();

  await Audit.create({
    admin: req.user.id,
    action: nextStatus === 'suspended' ? 'SUSPEND_WORKER' : 'UNSUSPEND_WORKER',
    targetModel: 'Worker',
    targetId: worker._id,
    details: { workerID: worker.workerID, status: nextStatus },
    ip: req.ip
  });

  return ApiResponse.success(res, worker, `Worker status updated to ${nextStatus}`);
});

export const deleteWorker = asyncHandler(async (req, res) => {
  const worker = await Worker.findById(req.params.id);
  if (!worker) return ApiResponse.error(res, 'Worker not found', 404);

  if (worker.photoPublicId) {
    await deleteFromCloudinary(worker.photoPublicId);
  }

  const posts = await Post.find({ worker: worker._id });
  const publicIds = posts.flatMap(p => p.media.map(m => m.publicId)).filter(Boolean);
  if (publicIds.length > 0) {
    await deleteMultipleFromCloudinary(publicIds);
  }

  await Post.deleteMany({ worker: worker._id });
  await Booking.deleteMany({ worker: worker._id });
  await Review.deleteMany({ worker: worker._id });
  await Worker.deleteOne({ _id: worker._id });

  await Audit.create({
    admin: req.user.id,
    action: 'DELETE_WORKER',
    targetModel: 'Worker',
    targetId: req.params.id,
    details: { workerID: worker.workerID, name: worker.name },
    ip: req.ip
  });

  return ApiResponse.success(res, { id: req.params.id }, 'Worker deleted successfully');
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-refreshToken').sort({ createdAt: -1 });
  return ApiResponse.success(res, users);
});

export const banUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return ApiResponse.error(res, 'User not found', 404);

  user.isBanned = !user.isBanned;
  await user.save();

  await Audit.create({
    admin: req.user.id,
    action: user.isBanned ? 'BAN_USER' : 'UNBAN_USER',
    targetModel: 'User',
    targetId: req.params.id,
    details: { name: user.name, mobile: user.mobile, isBanned: user.isBanned },
    ip: req.ip
  });

  return ApiResponse.success(res, user, `User ${user.isBanned ? 'banned' : 'unbanned'} successfully`);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return ApiResponse.error(res, 'User not found', 404);

  if (user.photoPublicId) {
    await deleteFromCloudinary(user.photoPublicId);
  }

  await Booking.deleteMany({ user: user._id });
  await Review.deleteMany({ user: user._id });
  await User.deleteOne({ _id: user._id });

  await Audit.create({
    admin: req.user.id,
    action: 'DELETE_USER',
    targetModel: 'User',
    targetId: req.params.id,
    details: { name: user.name, mobile: user.mobile },
    ip: req.ip
  });

  return ApiResponse.success(res, { id: req.params.id }, 'User deleted successfully');
});

export const getAnalyticsData = asyncHandler(async (req, res) => {
  const signups = await User.aggregate([
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);

  const workerSignups = await Worker.aggregate([
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);

  const bookingsByStatus = await Booking.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);

  return ApiResponse.success(res, { signupsTimeSeries: signups, workerSignupsTimeSeries: workerSignups, bookingsByStatus });
});

export const getAuditLogs = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 20);
  const skip = (page - 1) * limit;

  const data = await Audit.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate('admin', 'name email');
  const total = await Audit.countDocuments();
  return ApiResponse.paginated(res, data, total, page, limit);
});

export const getAllPosts = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const q = {};
  if (status && status !== 'all') q.status = status;

  const data = await Post.find(q).sort({ createdAt: -1 }).populate('worker', 'name workerID category photo');
  return ApiResponse.success(res, data);
});

export const updatePostStatus = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return ApiResponse.error(res, 'Post not found', 404);

  post.status = req.body.status;
  await post.save();

  await Audit.create({
    admin: req.user.id,
    action: 'UPDATE_POST_STATUS',
    targetModel: 'Post',
    targetId: post._id,
    details: { status: post.status },
    ip: req.ip
  });

  return ApiResponse.success(res, post, `Post status updated to ${post.status}`);
});

export default {
  getStats,
  getAllWorkers,
  getPendingWorkers,
  approveWorker,
  rejectWorker,
  suspendWorker,
  deleteWorker,
  getAllUsers,
  banUser,
  deleteUser,
  getAnalyticsData,
  getAuditLogs,
  getAllPosts,
  updatePostStatus
};

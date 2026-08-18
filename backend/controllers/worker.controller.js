import Worker from '../models/Worker.model.js';
import Booking from '../models/Booking.model.js';
import Review from '../models/Review.model.js';
import { mkdir, unlink, writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import ApiResponse from '../utils/apiResponse.js';
import paginate from '../utils/paginate.js';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryHelper.js';
import asyncHandler from '../middleware/asyncHandler.js';

const LOCAL_PHOTO_PREFIX = 'local-profile:';
const localProfilePhotoDirectory = path.resolve('uploads', 'profiles');

const removeStoredProfilePhoto = async (publicId) => {
  if (!publicId) return;

  if (publicId.startsWith(LOCAL_PHOTO_PREFIX)) {
    const filename = path.basename(publicId.slice(LOCAL_PHOTO_PREFIX.length));
    try {
      await unlink(path.join(localProfilePhotoDirectory, filename));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    return;
  }

  await deleteFromCloudinary(publicId);
};

const saveProfilePhotoLocally = async (file, req) => {
  await mkdir(localProfilePhotoDirectory, { recursive: true });
  const extension = file.mimetype === 'image/png' ? '.png' : file.mimetype === 'image/webp' ? '.webp' : '.jpg';
  const filename = `${randomUUID()}${extension}`;
  await writeFile(path.join(localProfilePhotoDirectory, filename), file.buffer);
  return {
    url: `${req.protocol}://${req.get('host')}/uploads/profiles/${filename}`,
    publicId: `${LOCAL_PHOTO_PREFIX}${filename}`,
  };
};

export const getAllWorkers = asyncHandler(async (req, res) => {
  const { category, city, rating, minPrice, maxPrice, search, sort, page = 1, limit = 12 } = req.query;
  const query = { status: { $in: ['active', 'pending'] } };

  if (category && category !== 'All') query.category = category;
  if (city) query.city = new RegExp(city, 'i');
  if (rating) query.rating = { $gte: Number(rating) };
  if (minPrice || maxPrice) query.pricePerDay = {};
  if (minPrice) query.pricePerDay.$gte = Number(minPrice);
  if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);

  if (search) {
    query.$or = [
      { name: new RegExp(search, 'i') },
      { category: new RegExp(search, 'i') },
      { city: new RegExp(search, 'i') },
      { skills: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  const sortMap = {
    newest: { createdAt: -1 },
    top_rated: { rating: -1 },
    price_low: { pricePerDay: 1 },
    price_high: { pricePerDay: -1 },
    most_reviewed: { reviewCount: -1 }
  };
  const sortObj = sortMap[sort] || { createdAt: -1 };
  const select = '-password -refreshToken';
  
  const { data, total } = await paginate(Worker, query, { page: Number(page), limit: Number(limit), sort: sortObj, select });
  return ApiResponse.paginated(res, data, total, Number(page), Number(limit));
});

export const getWorkerById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const auth = !!req.user;

  if (req.user?.role === 'worker') {
    return ApiResponse.error(res, 'Workers cannot access other worker profiles', 403);
  }

  const selectFields = auth
    ? '-password -refreshToken'
    : 'name photo category city state bio skills pricePerDay experience availability rating reviewCount workerID createdAt';

  const worker = await Worker.findById(id).select(selectFields);
  if (!worker) return ApiResponse.error(res, 'Worker not found', 404);

  const canView = worker.status === 'active' || worker.status === 'pending' || (req.user?.role === 'admin');
  if (!canView) return ApiResponse.error(res, 'Worker not found', 404);

  // Increment profile views
  worker.profileViews = (worker.profileViews || 0) + 1;
  if (req.user?.role === 'user') {
    const existingViewer = worker.profileViewers?.find((viewer) => String(viewer.user) === req.user.id);
    if (existingViewer) existingViewer.viewedAt = new Date();
    else worker.profileViewers.push({ user: req.user.id });
  }
  await worker.save();

  return ApiResponse.success(res, worker);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const updates = req.body;
  
  // Prevent updating restricted fields
  delete updates.workerID;
  delete updates.role;
  delete updates.status;
  delete updates.rating;
  delete updates.reviewCount;
  delete updates.password;

  const worker = await Worker.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).select('-password -refreshToken');
  return ApiResponse.success(res, worker, 'Profile updated successfully');
});

export const updateAvailability = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const { days, blockedDates, isAvailableNow } = req.body;

  const worker = await Worker.findById(id);
  if (!worker) return ApiResponse.error(res, 'Worker not found', 404);

  if (days !== undefined) worker.availability.days = days;
  if (blockedDates !== undefined) worker.availability.blockedDates = blockedDates;
  if (isAvailableNow !== undefined) worker.availability.isAvailableNow = isAvailableNow;

  await worker.save();
  return ApiResponse.success(res, worker.availability, 'Availability updated');
});

export const uploadProfilePhoto = asyncHandler(async (req, res) => {
  const id = req.user.id;
  if (!req.file) return ApiResponse.error(res, 'Please upload a photo', 400);

  const worker = await Worker.findById(id);
  if (!worker) return ApiResponse.error(res, 'Worker not found', 404);

  let uploaded;
  if (req.file.buffer) {
    try {
      uploaded = await uploadBufferToCloudinary(req.file.buffer, 'workerlink/profiles', 'image');
    } catch (error) {
      // Local development remains usable when Cloudinary has not been configured yet.
      uploaded = await saveProfilePhotoLocally(req.file, req);
    }
  } else {
    uploaded = {
      url: req.file.path || req.file.secure_url || req.file.url,
      publicId: req.file.filename || req.file.public_id || req.file.publicId,
    };
  }
  const photoUrl = uploaded.secure_url || uploaded.url;
  const publicId = uploaded.public_id || uploaded.publicId;

  await removeStoredProfilePhoto(worker.photoPublicId);
  worker.photo = photoUrl;
  worker.photoPublicId = publicId;
  await worker.save();

  return ApiResponse.success(res, { photo: worker.photo, photoPublicId: worker.photoPublicId }, 'Profile photo updated');
});

export const removeProfilePhoto = asyncHandler(async (req, res) => {
  const worker = await Worker.findById(req.user.id);
  if (!worker) return ApiResponse.error(res, 'Worker not found', 404);

  if (worker.photoPublicId) {
    await removeStoredProfilePhoto(worker.photoPublicId);
  }

  worker.photo = null;
  worker.photoPublicId = null;
  await worker.save();

  return ApiResponse.success(res, { photo: null, photoPublicId: null }, 'Profile photo removed');
});

export const getDashboardStats = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const worker = await Worker.findById(id).select('rating reviewCount profileViews status');
  if (!worker) return ApiResponse.error(res, 'Worker not found', 404);

  const totalBookings = await Booking.countDocuments({ worker: id });
  const pendingBookings = await Booking.countDocuments({ worker: id, status: 'pending' });
  const acceptedBookings = await Booking.countDocuments({ worker: id, status: 'accepted' });
  const completedBookings = await Booking.countDocuments({ worker: id, status: 'completed' });

  // Calculate earnings
  const completedList = await Booking.find({ worker: id, status: 'completed' }).select('amount createdAt');
  const totalEarnings = completedList.reduce((sum, b) => sum + (b.amount || 0), 0);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthEarnings = completedList
    .filter(b => new Date(b.createdAt) >= startOfMonth)
    .reduce((sum, b) => sum + (b.amount || 0), 0);

  const recentBookings = await Booking.find({ worker: id })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name mobile photo');

  return ApiResponse.success(res, {
    status: worker.status,
    totalBookings,
    pendingBookings,
    acceptedBookings,
    completedBookings,
    totalEarnings,
    thisMonthEarnings,
    rating: worker.rating,
    reviewCount: worker.reviewCount,
    profileViews: worker.profileViews,
    recentBookings
  });
});

export const getProfileViewers = asyncHandler(async (req, res) => {
  const worker = await Worker.findById(req.user.id)
    .select('profileViewers')
    .populate('profileViewers.user', 'name photo mobile');
  if (!worker) return ApiResponse.error(res, 'Worker not found', 404);

  const viewers = worker.profileViewers
    .filter((viewer) => viewer.user)
    .sort((a, b) => new Date(b.viewedAt) - new Date(a.viewedAt))
    .map((viewer) => ({ user: viewer.user, viewedAt: viewer.viewedAt }));
  return ApiResponse.success(res, viewers);
});

export const getReceivedReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ worker: req.user.id })
    .sort({ createdAt: -1 })
    .populate('user', 'name photo mobile');
  return ApiResponse.success(res, reviews);
});

export const getOwnProfile = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const worker = await Worker.findById(id).select('-password -refreshToken');
  return ApiResponse.success(res, worker);
});

export default { getAllWorkers, getWorkerById, updateProfile, updateAvailability, uploadProfilePhoto, removeProfilePhoto, getDashboardStats, getProfileViewers, getReceivedReviews, getOwnProfile };

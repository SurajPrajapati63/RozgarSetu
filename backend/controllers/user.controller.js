import User from '../models/User.model.js';
import ApiResponse from '../utils/apiResponse.js';
import { deleteFromCloudinary } from '../utils/cloudinaryHelper.js';

export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select('-refreshToken');
  return ApiResponse.success(res, user);
};

export const updateMe = async (req, res) => {
  const updates = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-refreshToken');
  return ApiResponse.success(res, user);
};

export const uploadPhoto = async (req, res) => {
  if (!req.file) return ApiResponse.error(res, 'No file', 400);
  const user = await User.findById(req.user.id);
  if (user.photoPublicId) await deleteFromCloudinary(user.photoPublicId);
  user.photo = req.file.path || req.file.secure_url || req.file.url;
  user.photoPublicId = req.file.filename || req.file.public_id || req.file.publicId;
  await user.save();
  return ApiResponse.success(res, { photo: user.photo });
};

export default { getMe, updateMe, uploadPhoto };

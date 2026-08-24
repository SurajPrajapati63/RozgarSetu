import bcrypt from 'bcryptjs';
import { mkdir, unlink, writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import User from '../models/User.model.js';
import ApiResponse from '../utils/apiResponse.js';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryHelper.js';

const LOCAL_PHOTO_PREFIX = 'local-user-profile:';
const localProfilePhotoDirectory = path.resolve('uploads', 'profiles');

const removeStoredUserPhoto = async (publicId) => {
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

const saveUserPhotoLocally = async (file, req) => {
  await mkdir(localProfilePhotoDirectory, { recursive: true });
  const extension = file.mimetype === 'image/png' ? '.png' : file.mimetype === 'image/webp' ? '.webp' : '.jpg';
  const filename = `user-${randomUUID()}${extension}`;
  await writeFile(path.join(localProfilePhotoDirectory, filename), file.buffer);
  return {
    url: `${req.protocol}://${req.get('host')}/uploads/profiles/${filename}`,
    publicId: `${LOCAL_PHOTO_PREFIX}${filename}`,
  };
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select('-refreshToken');
  if (!user) return ApiResponse.error(res, 'User not found', 404);
  return ApiResponse.success(res, user);
};

export const updateMe = async (req, res) => {
  const updates = { ...req.body };
  
  delete updates._id;
  delete updates.role;
  delete updates.mobile;
  delete updates.refreshToken;

  if (updates.password) {
    if (updates.password.length < 8) {
      return ApiResponse.error(res, 'Password must be at least 8 characters long', 400);
    }
    updates.password = await bcrypt.hash(updates.password, 12);
  } else {
    delete updates.password;
  }

  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select('-refreshToken');
  if (!user) return ApiResponse.error(res, 'User not found', 404);
  return ApiResponse.success(res, user, 'Profile updated successfully');
};

export const uploadPhoto = async (req, res) => {
  if (!req.file) return ApiResponse.error(res, 'Please upload a photo', 400);

  const user = await User.findById(req.user.id);
  if (!user) return ApiResponse.error(res, 'User not found', 404);

  let uploaded;
  if (req.file.buffer) {
    try {
      uploaded = await uploadBufferToCloudinary(req.file.buffer, 'workerlink/users', 'image');
    } catch (error) {
      uploaded = await saveUserPhotoLocally(req.file, req);
    }
  } else {
    uploaded = {
      url: req.file.path || req.file.secure_url || req.file.url,
      publicId: req.file.filename || req.file.public_id || req.file.publicId,
    };
  }

  const photoUrl = uploaded.secure_url || uploaded.url;
  const publicId = uploaded.public_id || uploaded.publicId;

  await removeStoredUserPhoto(user.photoPublicId);
  user.photo = photoUrl;
  user.photoPublicId = publicId;
  await user.save();

  return ApiResponse.success(res, { photo: user.photo, photoPublicId: user.photoPublicId }, 'User photo updated');
};

export default { getMe, updateMe, uploadPhoto };

import ApiResponse from '../utils/apiResponse.js';
import { uploadBufferToCloudinary } from '../utils/cloudinaryHelper.js';

const uploadFileToCloudinary = async (file) => {
  if (!file) throw new Error('No file provided');

  if (file.buffer) {
    const folder = file.fieldname === 'photo' ? 'workerlink/profiles' : 'workerlink/posts/images';
    const resourceType = file.mimetype?.startsWith('video/') ? 'video' : 'image';
    const result = await uploadBufferToCloudinary(file.buffer, folder, resourceType);
    return {
      url: result.secure_url || result.url || result.secureUrl,
      publicId: result.public_id || result.publicId,
    };
  }

  return {
    url: file.path || file.secure_url || file.url,
    publicId: file.filename || file.public_id || file.publicId,
  };
};

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) return ApiResponse.error(res, 'No file', 400);
    const uploaded = await uploadFileToCloudinary(req.file);
    return ApiResponse.success(res, { url: uploaded.url, publicId: uploaded.publicId });
  } catch (error) {
    return ApiResponse.error(res, error.message || 'Upload failed', 500);
  }
};

export const uploadImages = async (req, res) => {
  try {
    if (!req.files || !req.files.length) return ApiResponse.error(res, 'No files', 400);
    const mapped = await Promise.all(req.files.map((file) => uploadFileToCloudinary(file)));
    return ApiResponse.success(res, mapped);
  } catch (error) {
    return ApiResponse.error(res, error.message || 'Upload failed', 500);
  }
};

export const uploadVideo = uploadImage;

export const deleteFile = async (req, res) => {
  const { publicId } = req.body;
  if (!publicId) return ApiResponse.error(res, 'publicId required', 400);
  const { deleteFromCloudinary } = await import('../utils/cloudinaryHelper.js');
  await deleteFromCloudinary(publicId);
  return ApiResponse.success(res, {}, 'Deleted');
};

export default { uploadImage, uploadImages, uploadVideo, deleteFile };

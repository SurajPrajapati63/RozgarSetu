import cloudinary from '../config/cloudinary.js';

export const uploadToCloudinary = async (filePath, folder = 'workerlink/tmp', resourceType = 'auto') => {
  const res = await cloudinary.uploader.upload(filePath, { folder, resource_type: resourceType });
  return { url: res.secure_url, publicId: res.public_id };
};

export const uploadBufferToCloudinary = async (buffer, folder = 'workerlink/tmp', resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url || result.url,
          publicId: result.public_id,
          secure_url: result.secure_url || result.url,
          public_id: result.public_id,
        });
      }
    );

    stream.end(buffer);
  });
};

export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    // ignore
  }
};

export const deleteMultipleFromCloudinary = async (publicIds = [], resourceType = 'image') => {
  if (!publicIds.length) return;
  try { await cloudinary.api.delete_resources(publicIds, { resource_type: resourceType }); } catch (e) {}
};

export default { uploadToCloudinary, uploadBufferToCloudinary, deleteFromCloudinary, deleteMultipleFromCloudinary };

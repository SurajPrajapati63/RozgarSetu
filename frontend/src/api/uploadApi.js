import axiosInstance from './axiosInstance';

export async function uploadSingleImage(file) {
  const formData = new FormData();
  formData.append('photo', file);
  const response = await axiosInstance.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
}

export async function uploadMultipleImages(files) {
  const formData = new FormData();
  Array.from(files).forEach((file) => formData.append('media', file));
  const response = await axiosInstance.post('/upload/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
}

export async function deleteUploadedFile(publicId) {
  const response = await axiosInstance.delete('/upload', { data: { publicId } });
  return response.data;
}

export default { uploadSingleImage, uploadMultipleImages, deleteUploadedFile };

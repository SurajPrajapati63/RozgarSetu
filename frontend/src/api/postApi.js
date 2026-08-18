import axiosInstance from './axiosInstance';

export async function getWorkerPosts(workerId) {
  const response = await axiosInstance.get(`/posts/worker/${workerId}`);
  return response.data;
}

export async function createPost(formDataOrObject) {
  const isFormData = formDataOrObject instanceof FormData;
  const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
  const response = await axiosInstance.post('/posts', formDataOrObject, config);
  return response.data;
}

export async function updatePost(id, payload) {
  const response = await axiosInstance.patch(`/posts/${id}`, payload);
  return response.data;
}

export async function deletePost(id) {
  const response = await axiosInstance.delete(`/posts/${id}`);
  return response.data;
}

export default { getWorkerPosts, createPost, updatePost, deletePost };

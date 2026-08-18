import axiosInstance from './axiosInstance';

export async function submitReview(payload) {
  const response = await axiosInstance.post('/reviews', payload);
  return response.data;
}

export async function getWorkerReviews(workerId, page = 1) {
  const response = await axiosInstance.get(`/reviews/worker/${workerId}?page=${page}`);
  return response.data;
}

export async function getWorkerRatingSummary(workerId) {
  const response = await axiosInstance.get(`/reviews/worker/${workerId}/summary`);
  return response.data;
}

export default { submitReview, getWorkerReviews, getWorkerRatingSummary };

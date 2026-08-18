import axiosInstance from './axiosInstance';

export async function createBooking(payload) {
  const response = await axiosInstance.post('/bookings', payload);
  return response.data;
}

export async function getUserBookings(params = {}) {
  const response = await axiosInstance.get('/bookings/my', { params });
  return response.data;
}

export async function getWorkerBookings(params = {}) {
  const response = await axiosInstance.get('/bookings/worker', { params });
  return response.data;
}

export async function getBookingById(id) {
  const response = await axiosInstance.get(`/bookings/${id}`);
  return response.data;
}

export async function updateBookingStatus(id, status, cancelReason = '') {
  const response = await axiosInstance.patch(`/bookings/${id}/status`, { status, cancelReason });
  return response.data;
}

export async function cancelBooking(id, cancelReason = '') {
  const response = await axiosInstance.patch(`/bookings/${id}/cancel`, { cancelReason });
  return response.data;
}

export default { createBooking, getUserBookings, getWorkerBookings, getBookingById, updateBookingStatus, cancelBooking };

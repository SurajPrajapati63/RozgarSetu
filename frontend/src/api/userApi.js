import axiosInstance from './axiosInstance'

const unwrap = (response) => response.data

export async function getUserBookings() {
  const response = await axiosInstance.get('/bookings/my')
  return unwrap(response)
}

export async function submitReview(payload) {
  const response = await axiosInstance.post('/reviews', payload)
  return unwrap(response)
}

export async function getProfile() {
  const response = await axiosInstance.get('/users/me')
  return unwrap(response)
}

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

export async function updateProfile(payload) {
  const response = await axiosInstance.patch('/users/me', payload)
  return unwrap(response)
}

export async function uploadUserPhoto(file) {
  const formData = new FormData()
  formData.append('photo', file)
  const response = await axiosInstance.post('/users/me/photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return unwrap(response)
}

export default { getUserBookings, submitReview, getProfile, updateProfile, uploadUserPhoto }

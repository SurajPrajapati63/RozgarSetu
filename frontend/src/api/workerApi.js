import axiosInstance from './axiosInstance'

const unwrap = (response) => response.data

export async function getWorkers(params = {}) {
  const response = await axiosInstance.get('/workers', { params })
  return unwrap(response)
}

export async function getWorkerById(id) {
  const response = await axiosInstance.get(`/workers/${id}`)
  return unwrap(response)
}

export async function updateProfile(payload) {
  const response = await axiosInstance.patch('/workers/profile', payload)
  return unwrap(response)
}

export async function removeProfilePhoto() {
  const response = await axiosInstance.delete('/workers/photo')
  return unwrap(response)
}

export async function uploadProfilePhoto(file) {
  const formData = new FormData()
  formData.append('photo', file)
  const response = await axiosInstance.post('/workers/photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return unwrap(response)
}

export async function uploadPost(payload) {
  const response = await axiosInstance.post('/posts', payload)
  return unwrap(response)
}

export async function deletePost(id) {
  const response = await axiosInstance.delete(`/posts/${id}`)
  return unwrap(response)
}

export async function updateAvailability(payload) {
  const response = await axiosInstance.patch('/workers/availability', payload)
  return unwrap(response)
}

export async function updateBookingStatus(id, status) {
  const response = await axiosInstance.patch(`/bookings/${id}/status`, { status })
  return unwrap(response)
}

export async function getDashboardStats() {
  const response = await axiosInstance.get('/workers/dashboard/stats')
  return unwrap(response)
}

export async function getProfileViewers() {
  const response = await axiosInstance.get('/workers/dashboard/profile-viewers')
  return unwrap(response)
}

export async function getReceivedReviews() {
  const response = await axiosInstance.get('/workers/dashboard/reviews')
  return unwrap(response)
}

export async function getMyBookings() {
  const response = await axiosInstance.get('/bookings/worker')
  return unwrap(response)
}

export async function getOwnProfile() {
  const response = await axiosInstance.get('/workers/dashboard/me')
  return unwrap(response)
}

export async function getEarnings() {
  const response = await axiosInstance.get('/workers/dashboard/stats')
  const body = unwrap(response)
  return {
    ...body,
    data: [
      { month: 'Current', amount: body.data?.thisMonthEarnings || 0 },
    ],
  }
}

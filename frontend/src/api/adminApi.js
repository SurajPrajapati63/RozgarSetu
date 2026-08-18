import axiosInstance from './axiosInstance'

const unwrap = (response) => response.data

export async function getAllWorkers() {
  const response = await axiosInstance.get('/admin/workers')
  return unwrap(response)
}

export async function approveWorker(id) {
  const response = await axiosInstance.patch(`/admin/workers/${id}/approve`)
  return unwrap(response)
}

export async function rejectWorker(id) {
  const response = await axiosInstance.patch(`/admin/workers/${id}/reject`)
  return unwrap(response)
}

export async function getAllUsers() {
  const response = await axiosInstance.get('/admin/users')
  return unwrap(response)
}

export async function getAllBookings() {
  const response = await axiosInstance.get('/admin/bookings')
  return unwrap(response)
}

export async function getStats() {
  const response = await axiosInstance.get('/admin/stats')
  return unwrap(response)
}

export async function deleteUser(id) {
  const response = await axiosInstance.delete(`/admin/users/${id}`)
  return unwrap(response)
}

export async function deleteWorker(id) {
  const response = await axiosInstance.delete(`/admin/workers/${id}`)
  return unwrap(response)
}

export async function moderatePost(id, status = 'approved') {
  const response = await axiosInstance.patch(`/admin/posts/${id}/status`, { status })
  return unwrap(response)
}

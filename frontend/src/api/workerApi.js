import axiosInstance from './axiosInstance'
import { MOCK_WORKERS } from '../utils/constants'

const unwrap = (response) => response.data

const buildFallbackWorkersResponse = (params = {}) => ({
  success: true,
  message: 'Showing sample workers',
  data: MOCK_WORKERS,
  pagination: {
    total: MOCK_WORKERS.length,
    page: Number(params.page || 1),
    limit: Number(params.limit || MOCK_WORKERS.length),
    totalPages: 1,
  },
})

export async function getWorkers(params = {}) {
  try {
    const response = await axiosInstance.get('/workers', { params })
    const body = unwrap(response)
    const workers = Array.isArray(body?.data) ? body.data : []

    return {
      ...body,
      data: workers.length > 0 ? workers : MOCK_WORKERS,
      pagination: body?.pagination || {
        total: workers.length || MOCK_WORKERS.length,
        page: Number(params.page || 1),
        limit: Number(params.limit || workers.length || MOCK_WORKERS.length),
        totalPages: 1,
      },
    }
  } catch (error) {
    return buildFallbackWorkersResponse(params)
  }
}

export async function getWorkerById(id) {
  try {
    const response = await axiosInstance.get(`/workers/${id}`)
    return unwrap(response)
  } catch (error) {
    const fallbackWorker = MOCK_WORKERS.find((worker) => String(worker.id) === String(id) || String(worker._id) === String(id)) || MOCK_WORKERS[0]
    return {
      success: true,
      message: 'Showing sample worker profile',
      data: fallbackWorker,
    }
  }
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

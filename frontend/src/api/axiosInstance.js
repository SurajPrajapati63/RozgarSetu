import axios from 'axios'
import { API_BASE_URL } from '../utils/constants'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth()
      window.location.href = '/auth'
      return Promise.reject(error)
    }
    if (error.response?.status === 403) {
      window.location.href = '/unauthorized'
      return Promise.reject(error)
    }
    if (error.response?.status >= 500) {
      toast.error('Server error, please try again')
    }
    if (!originalRequest._retry && error.message?.includes('Network Error')) {
      originalRequest._retry = true
      return axiosInstance(originalRequest)
    }
    return Promise.reject(error)
  },
)

export default axiosInstance

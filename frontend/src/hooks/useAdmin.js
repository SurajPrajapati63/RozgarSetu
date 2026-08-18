import { useQuery } from '@tanstack/react-query'
import { getAllWorkers, getAllUsers, getAllBookings, getStats } from '../api/adminApi'

export function useAdminWorkers() {
  return useQuery({ queryKey: ['admin-workers'], queryFn: getAllWorkers, select: (res) => res.data })
}

export function useAdminUsers() {
  return useQuery({ queryKey: ['admin-users'], queryFn: getAllUsers, select: (res) => res.data })
}

export function useAdminBookings() {
  return useQuery({ queryKey: ['admin-bookings'], queryFn: getAllBookings, select: (res) => res.data })
}

export function useAdminStats() {
  return useQuery({ queryKey: ['admin-stats'], queryFn: getStats, select: (res) => res.data })
}

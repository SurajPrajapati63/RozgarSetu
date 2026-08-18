import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import bookingApi from '../api/bookingApi';
import toast from 'react-hot-toast';

export function useUserBookings(status) {
  return useQuery({
    queryKey: ['userBookings', status],
    queryFn: () => bookingApi.getUserBookings({ status }),
    select: (res) => res.data || []
  });
}

export function useWorkerBookings(status) {
  return useQuery({
    queryKey: ['workerBookings', status],
    queryFn: () => bookingApi.getWorkerBookings({ status }),
    select: (res) => res.data || []
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookingApi.createBooking,
    onSuccess: (res) => {
      toast.success(res.message || 'Booking created successfully!');
      queryClient.invalidateQueries({ queryKey: ['userBookings'] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to create booking');
    }
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, cancelReason }) => bookingApi.updateBookingStatus(id, status, cancelReason),
    onSuccess: (res) => {
      toast.success(res.message || 'Booking status updated');
      queryClient.invalidateQueries({ queryKey: ['workerBookings'] });
      queryClient.invalidateQueries({ queryKey: ['userBookings'] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to update status');
    }
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, cancelReason }) => bookingApi.cancelBooking(id, cancelReason),
    onSuccess: (res) => {
      toast.success(res.message || 'Booking cancelled');
      queryClient.invalidateQueries({ queryKey: ['userBookings'] });
      queryClient.invalidateQueries({ queryKey: ['workerBookings'] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to cancel booking');
    }
  });
}

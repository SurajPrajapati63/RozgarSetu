import { useState } from 'react'
import { BookingCard } from '../../worker/BookingCard'
import { useUserBookings, useCancelBooking } from '../../../hooks/useBookings'
import { Modal } from '../../common/Modal'
import { ReviewForm } from '../../worker/ReviewForm'
import { submitReview } from '../../../api/userApi'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

const tabs = ['All', 'Pending', 'Accepted', 'Completed', 'Cancelled', 'Rejected']

export function UserBookingList() {
  const [tab, setTab] = useState('All')
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null)
  const [cancellingBooking, setCancellingBooking] = useState(null)
  const [cancelReason, setCancelReason] = useState('')
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const queryClient = useQueryClient()

  const { data: bookings = [], isLoading, isError } = useUserBookings()
  const cancelBookingMutation = useCancelBooking()

  const filtered = bookings.filter((booking) => tab === 'All' || booking.status?.toLowerCase() === tab.toLowerCase())

  const handleReviewSubmit = async ({ rating, text }) => {
    if (!selectedBookingForReview) return
    setIsSubmittingReview(true)
    try {
      await submitReview({
        bookingId: selectedBookingForReview._id || selectedBookingForReview.id,
        rating,
        comment: text,
      })
      toast.success('Thank you! Your review has been published.')
      queryClient.invalidateQueries({ queryKey: ['userBookings'] })
      setSelectedBookingForReview(null)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not submit review')
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const handleConfirmCancel = () => {
    if (!cancellingBooking) return
    const id = cancellingBooking._id || cancellingBooking.id
    cancelBookingMutation.mutate(
      { id, cancelReason: cancelReason || 'Cancelled by user' },
      {
        onSuccess: () => {
          setCancellingBooking(null)
          setCancelReason('')
        }
      }
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tabs.map((value) => (
          <button key={value} onClick={() => setTab(value)} className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${tab === value ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
            {value}
          </button>
        ))}
      </div>
      <div className="grid gap-4">
        {isLoading && <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">Loading your bookings...</div>}
        {isError && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Unable to load your bookings. Please try again.</div>}
        {!isLoading && !isError && filtered.length === 0 && <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">No {tab === 'All' ? '' : `${tab.toLowerCase()} `}bookings found.</div>}
        {filtered.map((booking) => (
          <BookingCard
            key={booking._id || booking.id}
            booking={booking}
            onCancelClick={(b) => {
              setCancellingBooking(b)
              setCancelReason('')
            }}
            onReviewClick={(b) => setSelectedBookingForReview(b)}
            isUpdating={cancelBookingMutation.isPending && (cancellingBooking?._id || cancellingBooking?.id) === (booking._id || booking.id)}
          />
        ))}
      </div>

      {/* Review Modal */}
      <Modal open={Boolean(selectedBookingForReview)} onClose={() => setSelectedBookingForReview(null)} title="Review Service">
        {selectedBookingForReview && (
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-100">
              Reviewing service by <strong>{selectedBookingForReview.worker?.name || 'Worker'}</strong> on {new Date(selectedBookingForReview.serviceDate).toLocaleDateString()}
            </div>
            <ReviewForm onSubmit={handleReviewSubmit} isSubmitting={isSubmittingReview} />
          </div>
        )}
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal open={Boolean(cancellingBooking)} onClose={() => setCancellingBooking(null)} title="Cancel Booking Request">
        {cancellingBooking && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Are you sure you want to cancel your booking request for <strong>{cancellingBooking.worker?.name || 'this worker'}</strong> on {new Date(cancellingBooking.serviceDate).toLocaleDateString()}?
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Reason for cancellation (optional)
              </label>
              <input
                type="text"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Schedule changed, found alternative"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancellingBooking(null)}
                className="w-1/2 rounded-xl border border-slate-300 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={cancelBookingMutation.isPending}
                className="w-1/2 rounded-xl bg-red-600 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-70"
              >
                {cancelBookingMutation.isPending ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

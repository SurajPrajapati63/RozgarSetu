import { Badge } from '../common/Badge'
import { CheckCircle2, Star } from 'lucide-react'

export function BookingCard({ booking, onStatusChange, onCancelClick, onReviewClick, isUpdating = false }) {
  const statusLabel = booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)
  const statusVariant = booking.status === 'completed' || booking.status === 'Confirmed' ? 'verified' : booking.status === 'accepted' || booking.status === 'Accepted' ? 'active' : booking.status === 'pending' || booking.status === 'Pending' ? 'pending' : 'danger'

  const isPending = booking.status?.toLowerCase() === 'pending'
  const isAccepted = booking.status?.toLowerCase() === 'accepted'
  const isCompleted = booking.status?.toLowerCase() === 'completed'
  const isCancelled = booking.status?.toLowerCase() === 'cancelled'
  const isRejected = booking.status?.toLowerCase() === 'rejected'

  const workerContact = booking.worker?.mobile
    ? `${booking.worker.mobile}${booking.worker.email ? ` | ${booking.worker.email}` : ''}`
    : null

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-bold text-slate-900">{booking.user?.name || booking.userName || booking.worker?.name || booking.workerName || 'Client'}</div>
          {booking.contactNumber && <p className="text-xs text-slate-500 mt-0.5">User Contact: {booking.contactNumber}</p>}
          {isAccepted && workerContact && (
            <p className="text-xs text-emerald-700 font-semibold mt-1 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
              📞 Worker Contact: {workerContact}
            </p>
          )}
          <div className="mt-2 text-sm text-slate-600 font-medium">{booking.serviceDescription || booking.service || 'Service request'}</div>
        </div>
        <Badge status={statusLabel || 'Pending'} variant={statusVariant} />
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-50 pt-3">
        <span>Scheduled: <strong className="text-slate-700">{booking.serviceDate ? new Date(booking.serviceDate).toLocaleDateString() : booking.date}</strong></span>
        <span className="font-extrabold text-slate-900 text-sm">₹{booking.amount || booking.price || 0}</span>
      </div>

      {/* User Cancellation Action (Only Allowed for Pending) */}
      {isPending && onCancelClick && (
        <div className="mt-4 flex justify-between items-center border-t border-slate-100 pt-3 text-xs">
          <span className="text-amber-600 font-medium">Awaiting worker acceptance</span>
          <button type="button" className="btn-outline border-red-200 text-xs text-red-600 hover:bg-red-50" onClick={() => onCancelClick(booking)} disabled={isUpdating}>
            Cancel Booking
          </button>
        </div>
      )}

      {/* User Accepted Notice (Cannot Cancel Once Accepted) */}
      {isAccepted && !onStatusChange && (
        <div className="mt-4 flex justify-between items-center border-t border-slate-100 pt-3 text-xs">
          <span className="font-semibold text-emerald-600">✓ Accepted by worker</span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
            Cannot be cancelled
          </span>
        </div>
      )}

      {/* Worker Pending Actions */}
      {isPending && onStatusChange && (
        <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-3">
          <button type="button" className="btn-outline border-red-200 text-xs text-red-600 hover:bg-red-50" onClick={() => onStatusChange(booking, 'rejected')} disabled={isUpdating}>
            Reject
          </button>
          <button type="button" className="btn-primary text-xs" onClick={() => onStatusChange(booking, 'accepted')} disabled={isUpdating}>
            {isUpdating ? 'Saving...' : 'Accept Request'}
          </button>
        </div>
      )}

      {/* Worker Accepted Actions */}
      {isAccepted && onStatusChange && (
        <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-3">
          <button type="button" className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 flex items-center gap-1.5" onClick={() => onStatusChange(booking, 'completed')} disabled={isUpdating}>
            <CheckCircle2 size={14} /> {isUpdating ? 'Saving...' : 'Mark Completed'}
          </button>
        </div>
      )}

      {/* User Review Action */}
      {isCompleted && !booking.hasReview && onReviewClick && (
        <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-3">
          <button type="button" className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-600 flex items-center gap-1.5" onClick={() => onReviewClick(booking)}>
            <Star size={14} className="fill-white" /> Write Review
          </button>
        </div>
      )}

      {isCompleted && booking.hasReview && (
        <div className="mt-3 text-right text-xs font-medium text-amber-600 flex items-center justify-end gap-1">
          <Star size={13} className="fill-amber-400 text-amber-400" /> Review Submitted
        </div>
      )}

      {(isCancelled || isRejected) && booking.cancelReason && (
        <div className="mt-3 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
          Reason: {booking.cancelReason}
        </div>
      )}
    </div>
  )
}

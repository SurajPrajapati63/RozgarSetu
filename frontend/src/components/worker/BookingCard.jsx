import { Badge } from '../common/Badge'

export function BookingCard({ booking, onStatusChange, isUpdating = false }) {
  const statusLabel = booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)
  const statusVariant = booking.status === 'completed' || booking.status === 'Confirmed' ? 'verified' : booking.status === 'accepted' || booking.status === 'Accepted' ? 'active' : booking.status === 'pending' || booking.status === 'Pending' ? 'pending' : 'danger'

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-semibold text-slate-900">{booking.user?.name || booking.userName || booking.worker?.name || booking.workerName || 'Client'}</div>
          <div className="mt-1 text-sm text-slate-600">{booking.serviceDescription || booking.service || 'Service request'}</div>
        </div>
        <Badge status={statusLabel || 'Pending'} variant={statusVariant} />
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
        <span>{booking.serviceDate ? new Date(booking.serviceDate).toLocaleDateString() : booking.date}</span>
        <span className="font-semibold text-slate-900">₹{booking.amount || booking.price || 0}</span>
      </div>
      {booking.status?.toLowerCase() === 'pending' && onStatusChange && (
        <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-4">
          <button type="button" className="btn-outline border-red-200 text-sm text-red-600 hover:bg-red-50" onClick={() => onStatusChange(booking, 'rejected')} disabled={isUpdating}>
            Reject
          </button>
          <button type="button" className="btn-primary text-sm" onClick={() => onStatusChange(booking, 'accepted')} disabled={isUpdating}>
            {isUpdating ? 'Saving...' : 'Accept'}
          </button>
        </div>
      )}
    </div>
  )
}

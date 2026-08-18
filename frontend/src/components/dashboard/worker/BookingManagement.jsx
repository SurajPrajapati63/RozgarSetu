import { useEffect, useState } from 'react'
import { BookingCard } from '../../worker/BookingCard'
import { getWorkerBookings, updateBookingStatus } from '../../../api/bookingApi'
import toast from 'react-hot-toast'

export function BookingManagement() {
  const [tab, setTab] = useState('All')
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await getWorkerBookings({ status: 'all' })
        setBookings(Array.isArray(response?.data) ? response.data : [])
      } catch {
        setBookings([])
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [])

  const filtered = bookings.filter((booking) => tab === 'All' || booking.status?.toLowerCase() === tab.toLowerCase())

  const handleStatusChange = async (booking, status) => {
    const id = booking._id || booking.id
    setUpdatingId(id)
    try {
      const response = await updateBookingStatus(id, status, status === 'rejected' ? 'Rejected by worker' : '')
      const updated = response?.data || response
      setBookings((current) => current.map((item) => (item._id || item.id) === id ? updated : item))
      toast.success(`Booking ${status}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || `Could not ${status} booking`)
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {['All', 'Pending', 'Accepted', 'Completed', 'Cancelled'].map((value) => (
          <button key={value} onClick={() => setTab(value)} className={`rounded-full px-3 py-2 text-sm font-medium ${tab === value ? 'bg-secondary text-white' : 'bg-slate-100 text-slate-700'}`}>
            {value}
          </button>
        ))}
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-600">
        Showing only your bookings.
      </div>
      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">Loading bookings...</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">No bookings found.</div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((booking) => <BookingCard key={booking._id || booking.id} booking={booking} onStatusChange={handleStatusChange} isUpdating={updatingId === (booking._id || booking.id)} />)}
        </div>
      )}
    </div>
  )
}

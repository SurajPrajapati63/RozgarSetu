import { useState } from 'react'
import { BookingCard } from '../../worker/BookingCard'
import { useUserBookings } from '../../../hooks/useBookings'

const tabs = ['All', 'Pending', 'Accepted', 'Completed', 'Cancelled', 'Rejected']

export function UserBookingList() {
  const [tab, setTab] = useState('All')
  const { data: bookings = [], isLoading, isError } = useUserBookings()
  const filtered = bookings.filter((booking) => tab === 'All' || booking.status?.toLowerCase() === tab.toLowerCase())

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tabs.map((value) => (
          <button key={value} onClick={() => setTab(value)} className={`rounded-full px-3 py-2 text-sm font-medium ${tab === value ? 'bg-secondary text-white' : 'bg-slate-100 text-slate-700'}`}>
            {value}
          </button>
        ))}
      </div>
      <div className="grid gap-4">
        {isLoading && <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">Loading your bookings...</div>}
        {isError && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Unable to load your bookings. Please try again.</div>}
        {!isLoading && !isError && filtered.length === 0 && <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">No {tab === 'All' ? '' : `${tab.toLowerCase()} `}bookings found.</div>}
        {filtered.map((booking) => <BookingCard key={booking._id || booking.id} booking={booking} />)}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { BookingCard } from '../../worker/BookingCard'

const bookings = [
  { id: 1, workerName: 'Aman Verma', service: 'Leak repair', date: 'Jun 28', price: 450, status: 'Confirmed' },
  { id: 2, workerName: 'Riya Singh', service: 'Electrical repair', date: 'Jul 02', price: 620, status: 'Cancelled' },
]

export function UserBookingList() {
  const [tab, setTab] = useState('All')
  const filtered = bookings.filter((booking) => tab === 'All' || booking.status === tab)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {['All', 'Confirmed', 'Cancelled'].map((value) => (
          <button key={value} onClick={() => setTab(value)} className={`rounded-full px-3 py-2 text-sm font-medium ${tab === value ? 'bg-secondary text-white' : 'bg-slate-100 text-slate-700'}`}>
            {value}
          </button>
        ))}
      </div>
      <div className="grid gap-4">
        {filtered.map((booking) => <BookingCard key={booking.id} booking={booking} />)}
      </div>
    </div>
  )
}

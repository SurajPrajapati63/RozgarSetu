import { useAdminBookings } from '../../hooks/useAdmin'

export function BookingOversightTable() {
  const { data: bookings = [] } = useAdminBookings()

  return (
    <div className="card overflow-hidden">
      <div className="mb-4 text-lg font-semibold text-slate-900">Booking oversight</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Booking ID</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Worker</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{booking.id}</td>
                <td className="px-4 py-3">{booking.userName}</td>
                <td className="px-4 py-3">{booking.workerName}</td>
                <td className="px-4 py-3">{booking.status}</td>
                <td className="px-4 py-3">₹{booking.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

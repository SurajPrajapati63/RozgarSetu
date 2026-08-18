import { Navbar } from '../../components/common/Navbar'
import { UserBookingList } from '../../components/dashboard/user/UserBookingList'

export default function UserBookings() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-semibold text-slate-900">Your bookings</h1>
        <UserBookingList />
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { Navbar } from '../../components/common/Navbar'
import { UserBookingList } from '../../components/dashboard/user/UserBookingList'

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap gap-3">
          <Link to="/dashboard/user/bookings" className="btn-primary">My bookings</Link>
        </div>
        <div className="card">
          <h2 className="mb-4 text-2xl font-semibold text-slate-900">My bookings</h2>
          <UserBookingList />
        </div>
      </div>
    </div>
  )
}

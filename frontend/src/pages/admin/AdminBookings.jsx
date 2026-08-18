import { AdminSidebar } from '../../components/admin/AdminSidebar'
import { BookingOversightTable } from '../../components/admin/BookingOversightTable'

export default function AdminBookings() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8">
        <h1 className="mb-6 text-3xl font-semibold text-slate-900">Bookings</h1>
        <BookingOversightTable />
      </main>
    </div>
  )
}

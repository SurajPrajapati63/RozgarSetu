import { useQuery } from '@tanstack/react-query'
import { getWorkers } from '../../api/workerApi'
import { getUserBookings } from '../../api/bookingApi'
import { useAuthStore } from '../../store/authStore'

export function StatsSection() {
  const role = useAuthStore((state) => state.role)
  const { data: workersResponse } = useQuery({
    queryKey: ['landing-workers'],
    queryFn: () => getWorkers({ limit: 100 }),
  })

  const { data: bookingsResponse } = useQuery({
    queryKey: ['landing-bookings'],
    queryFn: () => getUserBookings({ limit: 100 }),
    enabled: role === 'user',
  })

  const workers = Array.isArray(workersResponse?.data) ? workersResponse.data : []
  const bookings = Array.isArray(bookingsResponse?.data) ? bookingsResponse.data : []

  const cityCount = new Set(workers.map((worker) => worker.city).filter(Boolean)).size

  const stats = [
    { label: 'Workers', value: workers.length.toString() },
    { label: 'Cities', value: `${cityCount}+` },
    { label: 'Bookings', value: bookings.length.toString() },
  ]

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-6 rounded-3xl bg-slate-900 p-8 text-white md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-3xl font-semibold">{stat.value}</div>
            <div className="mt-2 text-sm text-slate-300">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

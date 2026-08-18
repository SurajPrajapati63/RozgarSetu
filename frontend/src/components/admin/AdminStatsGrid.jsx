import { useAdminStats } from '../../hooks/useAdmin'

export function AdminStatsGrid() {
  const { data } = useAdminStats()
  const stats = [
    { label: 'Total workers', value: data?.totalWorkers ?? 0 },
    { label: 'Pending approvals', value: data?.pendingApprovals ?? 0 },
    { label: 'Total users', value: data?.totalUsers ?? 0 },
    { label: 'Total bookings', value: data?.totalBookings ?? 0 },
    { label: 'Revenue', value: `₹${data?.totalRevenue ?? 0}` },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat) => (
        <div key={stat.label} className="card">
          <div className="text-sm text-slate-500">{stat.label}</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">{stat.value}</div>
        </div>
      ))}
    </div>
  )
}

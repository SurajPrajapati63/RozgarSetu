import { useEffect, useState } from 'react'
import { CalendarCheck, Eye, Star } from 'lucide-react'
import { getDashboardStats } from '../../../api/workerApi'

export function DashboardStats({ onStatClick }) {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getDashboardStats()
      .then((response) => setStats(response?.data || response))
      .catch(() => setStats({ totalBookings: 0, profileViews: 0, rating: 0 }))
  }, [])

  const items = [
    { key: 'bookings', label: 'Total bookings', value: stats?.totalBookings ?? 0, icon: CalendarCheck },
    { key: 'viewers', label: 'Profile views', value: stats?.profileViews ?? 0, icon: Eye },
    { key: 'reviews', label: 'Average rating', value: `${Number(stats?.rating || 0).toFixed(1)} / 5`, icon: Star },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {items.map(({ key, label, value, icon: Icon }) => {
        return (
        <button key={label} type="button" onClick={() => onStatClick?.(key)} className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm hover:border-indigo-300 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <Icon size={18} className="mx-auto text-indigo-600" />
          <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
          <div className="mt-1 text-sm text-slate-500">{label}</div>
        </button>
        )
      })}
    </div>
  )
}

import { AdminSidebar } from '../../components/admin/AdminSidebar'
import { AdminStatsGrid } from '../../components/admin/AdminStatsGrid'
import { AnalyticsChart } from '../../components/admin/AnalyticsChart'

export default function AdminAnalytics() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8">
        <h1 className="mb-6 text-3xl font-semibold text-slate-900">Analytics</h1>
        <AdminStatsGrid />
        <div className="mt-8">
          <AnalyticsChart />
        </div>
      </main>
    </div>
  )
}

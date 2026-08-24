import { useQuery } from '@tanstack/react-query'
import { Navbar } from '../../components/common/Navbar'
import { EarningsChart } from '../../components/worker/EarningsChart'
import { getDashboardStats } from '../../api/workerApi'
import { formatCurrency } from '../../utils/formatters'

export default function WorkerEarnings() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['workerDashboardStats'],
    queryFn: () => getDashboardStats(),
  })

  const stats = response?.data || {}
  const totalEarnings = stats.totalEarnings || 0
  const thisMonthEarnings = stats.thisMonthEarnings || 0
  const completedBookings = stats.completedBookings || 0

  const chartData = [
    { month: 'This Month', amount: thisMonthEarnings },
    { month: 'Total Earned', amount: totalEarnings },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold text-slate-900">Earnings Summary</h1>
        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading earnings data...</div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <EarningsChart data={chartData} />
            <div className="card space-y-5">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Earned</div>
                <div className="text-3xl font-extrabold text-blue-600 mt-1">{formatCurrency(totalEarnings)}</div>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">This Month</div>
                <div className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(thisMonthEarnings)}</div>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Completed Jobs</div>
                <div className="text-2xl font-bold text-slate-800 mt-1">{completedBookings} jobs completed</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

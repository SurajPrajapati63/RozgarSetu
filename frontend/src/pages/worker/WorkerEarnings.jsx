import { Navbar } from '../../components/common/Navbar'
import { EarningsChart } from '../../components/worker/EarningsChart'

const earningsData = [{ month: 'Jan', amount: 12000 }, { month: 'Feb', amount: 14000 }, { month: 'Mar', amount: 9600 }, { month: 'Apr', amount: 16200 }, { month: 'May', amount: 18800 }, { month: 'Jun', amount: 17000 }]

export default function WorkerEarnings() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-semibold text-slate-900">Earnings</h1>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <EarningsChart data={earningsData} />
          <div className="card space-y-4">
            <div>
              <div className="text-sm text-slate-500">Total earned</div>
              <div className="text-2xl font-semibold text-slate-900">₹88,000</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">This month</div>
              <div className="text-2xl font-semibold text-slate-900">₹17,000</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Pending payout</div>
              <div className="text-2xl font-semibold text-slate-900">₹4,500</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

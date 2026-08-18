import { Navbar } from '../../components/common/Navbar'

export default function WorkerSettings() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-semibold text-slate-900">Settings</h1>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Change password</h3>
            <input className="input-field" placeholder="New password" />
            <button className="btn-primary">Update</button>
          </div>
          <div className="card space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Notifications</h3>
            <label className="flex items-center justify-between text-sm text-slate-700"><span>Email notifications</span><input type="checkbox" defaultChecked /></label>
            <label className="flex items-center justify-between text-sm text-slate-700"><span>SMS notifications</span><input type="checkbox" defaultChecked /></label>
            <button className="btn-outline">Save preferences</button>
          </div>
        </div>
      </div>
    </div>
  )
}

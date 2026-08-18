import { AdminSidebar } from '../../components/admin/AdminSidebar'
import { AuditLogTable } from '../../components/admin/AuditLogTable'

export default function AdminSettings() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8">
        <h1 className="mb-6 text-3xl font-semibold text-slate-900">Settings</h1>
        <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Platform controls</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
              Worker auto-approval
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
              Post moderation required
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
            </label>
          </div>
        </section>
        <AuditLogTable />
      </main>
    </div>
  )
}

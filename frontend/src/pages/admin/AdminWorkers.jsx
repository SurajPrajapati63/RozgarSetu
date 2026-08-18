import { AdminSidebar } from '../../components/admin/AdminSidebar'
import { WorkerManagementTable } from '../../components/admin/WorkerManagementTable'

export default function AdminWorkers() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8">
        <h1 className="mb-6 text-3xl font-semibold text-slate-900">Workers</h1>
        <WorkerManagementTable />
      </main>
    </div>
  )
}

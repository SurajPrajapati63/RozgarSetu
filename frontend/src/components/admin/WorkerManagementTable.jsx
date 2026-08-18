import { useAdminWorkers } from '../../hooks/useAdmin'

export function WorkerManagementTable() {
  const { data: workers = [] } = useAdminWorkers()

  return (
    <div className="card overflow-hidden">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-lg font-semibold text-slate-900">Worker management</div>
        <button className="btn-outline">Export CSV</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Worker ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {workers.map((worker) => (
              <tr key={worker.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{worker.id}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{worker.name}</td>
                <td className="px-4 py-3">{worker.category}</td>
                <td className="px-4 py-3">{worker.status}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="btn-outline">View</button>
                    <button className="btn-primary">Suspend</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

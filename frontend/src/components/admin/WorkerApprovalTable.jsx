import { useAdminWorkers } from '../../hooks/useAdmin'

export function WorkerApprovalTable() {
  const { data: workers = [] } = useAdminWorkers()
  const pendingWorkers = workers.filter((worker) => worker.status === 'pending')

  return (
    <div className="card overflow-hidden">
      <div className="mb-4 text-lg font-semibold text-slate-900">Pending approvals</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingWorkers.map((worker) => (
              <tr key={worker.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-900">{worker.name}</td>
                <td className="px-4 py-3">{worker.category}</td>
                <td className="px-4 py-3">{worker.city}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="btn-primary">Approve</button>
                    <button className="btn-outline">Reject</button>
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

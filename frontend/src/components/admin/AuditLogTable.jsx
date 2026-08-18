const logs = [
  { id: 1, action: 'Approved worker', actor: 'Admin', time: '2 mins ago' },
  { id: 2, action: 'Removed post', actor: 'Admin', time: '15 mins ago' },
]

export function AuditLogTable() {
  return (
    <div className="card overflow-hidden">
      <div className="mb-4 text-lg font-semibold text-slate-900">Recent admin activity</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Actor</th>
              <th className="px-4 py-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{log.action}</td>
                <td className="px-4 py-3">{log.actor}</td>
                <td className="px-4 py-3">{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

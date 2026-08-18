import { useAdminUsers } from '../../hooks/useAdmin'

export function UserManagementTable() {
  const { data: users = [] } = useAdminUsers()

  return (
    <div className="card overflow-hidden">
      <div className="mb-4 text-lg font-semibold text-slate-900">Users</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">Bookings</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-900">{user.name}</td>
                <td className="px-4 py-3">{user.mobile}</td>
                <td className="px-4 py-3">{user.bookings}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="btn-outline">View</button>
                    <button className="btn-primary">Ban</button>
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

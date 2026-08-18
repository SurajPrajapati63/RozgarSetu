import { AdminSidebar } from '../../components/admin/AdminSidebar'
import { UserManagementTable } from '../../components/admin/UserManagementTable'

export default function AdminUsers() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8">
        <h1 className="mb-6 text-3xl font-semibold text-slate-900">Users</h1>
        <UserManagementTable />
      </main>
    </div>
  )
}

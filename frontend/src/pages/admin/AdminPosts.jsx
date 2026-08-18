import { AdminSidebar } from '../../components/admin/AdminSidebar'
import { PostModerationGrid } from '../../components/admin/PostModerationGrid'

export default function AdminPosts() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8">
        <h1 className="mb-6 text-3xl font-semibold text-slate-900">Posts</h1>
        <PostModerationGrid />
      </main>
    </div>
  )
}

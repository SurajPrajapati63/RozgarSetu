import { LayoutDashboard, Users, BriefcaseBusiness, BookOpen, Flag, BarChart3, Settings } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/workers', label: 'Workers', icon: BriefcaseBusiness },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/bookings', label: 'Bookings', icon: BookOpen },
  { to: '/admin/posts', label: 'Posts', icon: Flag },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminSidebar() {
  const location = useLocation()
  return (
    <aside className="hidden min-h-screen w-72 border-r border-slate-200 bg-slate-950 p-6 text-slate-200 lg:block">
      <div className="mb-8 text-2xl font-semibold text-white">WorkerLink Admin</div>
      <div className="flex flex-col gap-2">
        {links.map((link) => {
          const Icon = link.icon
          const active = location.pathname === link.to
          return (
            <Link key={link.to} to={link.to} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${active ? 'bg-secondary text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
              <Icon size={16} /> {link.label}
            </Link>
          )
        })}
      </div>
    </aside>
  )
}

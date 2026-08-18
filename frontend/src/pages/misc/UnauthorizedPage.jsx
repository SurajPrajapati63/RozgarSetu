import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <ShieldAlert size={24} />
        </div>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">Access denied</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Your account does not have permission to open this area.
        </p>
        <Link to="/" className="btn-primary mt-6 inline-flex items-center justify-center gap-2">
          Back to home
        </Link>
      </section>
    </main>
  )
}

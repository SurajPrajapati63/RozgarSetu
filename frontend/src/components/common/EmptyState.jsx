export function EmptyState({ title, message, action }) {
  return (
    <div className="card text-center">
      <h3 className="mb-2 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mb-4 text-sm text-slate-600">{message}</p>
      {action}
    </div>
  )
}

export function Loader({ message = 'Loading workspace...' }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        <p className="text-sm font-medium text-slate-600">{message}</p>
      </div>
    </div>
  )
}

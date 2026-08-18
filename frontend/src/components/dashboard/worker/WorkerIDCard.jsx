import { Copy } from 'lucide-react'
import toast from 'react-hot-toast'

export function WorkerIDCard({ workerId }) {
  const handleCopy = async () => {
    if (!workerId) return

    try {
      await navigator.clipboard.writeText(workerId)
      toast.success('Worker ID copied to clipboard')
    } catch {
      toast.error('Unable to copy Worker ID')
    }
  }

  return (
    <div className="card flex items-center justify-between">
      <div>
        <div className="text-sm text-slate-500">Your Worker ID</div>
        <div className="text-xl font-semibold text-slate-900">{workerId}</div>
      </div>
      <button type="button" onClick={handleCopy} className="btn-outline inline-flex items-center gap-2">
        <Copy size={14} /> Copy
      </button>
    </div>
  )
}

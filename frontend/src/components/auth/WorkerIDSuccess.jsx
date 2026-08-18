import { CheckCircle2, Copy } from 'lucide-react'

export function WorkerIDSuccess({ workerID, onLogin }) {
  const copyID = async () => navigator.clipboard?.writeText(workerID)

  return (
    <div className="space-y-5 py-4 text-center">
      <CheckCircle2 className="mx-auto text-green-600" size={52} />
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Worker account created</h2>
        <p className="mt-2 text-sm text-slate-600">Keep this Worker ID safe. You will use it to log in.</p>
      </div>
      <button type="button" onClick={copyID} className="mx-auto flex items-center gap-2 rounded-xl bg-primary/5 px-4 py-3 font-mono text-lg font-semibold text-primary">
        {workerID} <Copy size={17} />
      </button>
      <button type="button" onClick={onLogin} className="btn-primary w-full">Go to Login</button>
    </div>
  )
}

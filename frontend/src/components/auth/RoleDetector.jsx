import { getRoleLabel } from '../../utils/roleDetect'

export function RoleDetector({ value }) {
  if (!value) return null
  return (
    <div className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
      Detected: {getRoleLabel(value)}
    </div>
  )
}

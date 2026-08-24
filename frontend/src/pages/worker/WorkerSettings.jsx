import { useState } from 'react'
import { Navbar } from '../../components/common/Navbar'
import { updateProfile } from '../../api/workerApi'
import toast from 'react-hot-toast'

export default function WorkerSettings() {
  const [password, setPassword] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [emailNotif, setEmailNotif] = useState(true)
  const [smsNotif, setSmsNotif] = useState(true)

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    if (!password || password.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    setIsUpdating(true)
    try {
      await updateProfile({ password })
      toast.success('Password updated successfully')
      setPassword('')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not update password')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSavePreferences = () => {
    toast.success('Notification preferences saved')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold text-slate-900">Account Settings</h1>
        <div className="grid gap-6 lg:grid-cols-2">
          <form className="card space-y-4" onSubmit={handlePasswordUpdate}>
            <h3 className="text-lg font-bold text-slate-900">Change Password</h3>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Enter new password (min 8 characters)"
              />
            </div>
            <button type="submit" disabled={isUpdating} className="btn-primary">
              {isUpdating ? 'Updating...' : 'Update Password'}
            </button>
          </form>

          <div className="card space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Notification Preferences</h3>
            <label className="flex items-center justify-between text-sm font-medium text-slate-700">
              <span>Email notifications</span>
              <input type="checkbox" checked={emailNotif} onChange={(e) => setEmailNotif(e.target.checked)} className="h-4 w-4 text-blue-600 rounded" />
            </label>
            <label className="flex items-center justify-between text-sm font-medium text-slate-700">
              <span>SMS notifications</span>
              <input type="checkbox" checked={smsNotif} onChange={(e) => setSmsNotif(e.target.checked)} className="h-4 w-4 text-blue-600 rounded" />
            </label>
            <button type="button" className="btn-outline" onClick={handleSavePreferences}>
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

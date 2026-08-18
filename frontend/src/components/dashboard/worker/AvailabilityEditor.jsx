import { useEffect, useState } from 'react'
import { updateAvailability } from '../../../api/workerApi'
import { useAuthStore } from '../../../store/authStore'
import toast from 'react-hot-toast'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function AvailabilityEditor() {
  const user = useAuthStore((state) => state.user)
  const updateUser = useAuthStore((state) => state.updateUser)
  const [available, setAvailable] = useState(user?.availability?.days || ['Mon', 'Tue', 'Wed'])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setAvailable(user?.availability?.days || ['Mon', 'Tue', 'Wed'])
  }, [user])

  const toggle = (day) => {
    setAvailable((current) => current.includes(day) ? current.filter((item) => item !== day) : [...current, day])
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await updateAvailability({
        days: available,
        isAvailableNow: user?.availability?.isAvailableNow ?? true,
      })
      updateUser({ availability: response?.data || response })
      toast.success('Availability saved successfully')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not save availability')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="card space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Weekly availability</h3>
      <div className="flex flex-wrap gap-2">
        {days.map((day) => (
          <button
            key={day}
            type="button"
            className={`rounded-full px-3 py-2 text-sm font-medium ${available.includes(day) ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-700'}`}
            onClick={() => toggle(day)}
          >
            {day}
          </button>
        ))}
      </div>
      <button type="button" onClick={handleSave} className="btn-primary" disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save availability'}
      </button>
    </div>
  )
}

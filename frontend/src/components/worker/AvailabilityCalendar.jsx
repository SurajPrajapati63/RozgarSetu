const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function AvailabilityCalendar({ available }) {
  return (
    <div className="card">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">Availability calendar</h3>
      <div className="flex flex-wrap gap-2">
        {days.map((day) => (
          <div key={day} className={`rounded-full px-3 py-1 text-sm ${available.includes(day) ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
            {day}
          </div>
        ))}
      </div>
    </div>
  )
}

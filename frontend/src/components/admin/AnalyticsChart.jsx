import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { day: 'Mon', users: 12, bookings: 5 },
  { day: 'Tue', users: 18, bookings: 7 },
  { day: 'Wed', users: 15, bookings: 6 },
  { day: 'Thu', users: 23, bookings: 10 },
  { day: 'Fri', users: 19, bookings: 9 },
]

export function AnalyticsChart() {
  return (
    <div className="card h-72">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">Signups and bookings</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="users" stroke="#053968" />
          <Line type="monotone" dataKey="bookings" stroke="#16A34A" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

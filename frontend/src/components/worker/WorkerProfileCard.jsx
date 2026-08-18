import { MapPin, Phone } from 'lucide-react'
import { Badge } from '../common/Badge'
import { RatingStars } from '../common/RatingStars'
import { formatCurrency } from '../../utils/formatters'

export function WorkerProfileCard({ worker, onContact, onBook }) {
  return (
    <div className="card space-y-5">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <img src={worker.photo} alt={worker.name} className="h-28 w-28 rounded-full object-cover" loading="lazy" />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-semibold text-slate-900">{worker.name}</h2>
            {worker.verified && <Badge status="Verified" variant="verified" />}
          </div>
          <p className="mt-2 text-sm text-slate-600">{worker.category}</p>
          <div className="mt-3 flex items-center gap-2 text-sm text-slate-600"><MapPin size={14} /> {worker.city}, {worker.state}</div>
          <div className="mt-2 flex items-center gap-2"><RatingStars rating={worker.rating} count={worker.reviews} /></div>
          <div className="mt-3 flex flex-wrap gap-3">
            <button onClick={onContact} className="btn-outline inline-flex items-center gap-2"><Phone size={16} /> Contact Worker</button>
            <button onClick={onBook} className="btn-primary">Book Now</button>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {worker.skills?.map((skill) => <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{skill}</span>)}
      </div>
      <div className="grid gap-4 rounded-2xl bg-slate-50 p-4 sm:grid-cols-3">
        <div><div className="text-sm text-slate-500">Starting price</div><div className="font-semibold text-slate-900">{formatCurrency(worker.price)}/day</div></div>
        <div><div className="text-sm text-slate-500">Availability</div><div className="font-semibold text-slate-900">{worker.available ? 'Available' : 'Busy'}</div></div>
        <div><div className="text-sm text-slate-500">Experience</div><div className="font-semibold text-slate-900">6+ years</div></div>
      </div>
    </div>
  )
}

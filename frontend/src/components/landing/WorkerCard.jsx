import { useNavigate } from 'react-router-dom';
import { MapPin, Star, ShieldCheck, Clock } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useAuthStore } from '../../store/authStore';

export function WorkerCard({ worker }) {
  const navigate = useNavigate();
  const { role } = useAuthStore();

  const workerId = worker._id || worker.id;
  const fallbackPhoto = 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80';

  const handleCardClick = () => {
    if (role === 'worker') {
      return;
    }

    navigate(`/worker/${workerId}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-slate-200 ${role === 'worker' ? 'cursor-default' : 'cursor-pointer'}`}
    >
      {/* Top Banner / Image & Badges */}
      <div className="relative mb-4 flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-slate-100 border border-slate-200">
          <img
            src={worker.photo || fallbackPhoto}
            alt={worker.name}
            loading="lazy"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = fallbackPhoto; }}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {worker.name}
            </h3>
            {worker.status === 'active' && (
              <ShieldCheck className="h-4 w-4 shrink-0 text-blue-600" title="Verified Worker" />
            )}
          </div>

          <span className="inline-block self-start mt-1 rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600">
            {worker.category || 'General Worker'}
          </span>
        </div>
      </div>

      {/* Bio / Description */}
      <p className="mb-4 text-xs text-slate-600 line-clamp-2 leading-relaxed">
        {worker.bio || `Experienced ${worker.category || 'service'} provider offering reliable local services.`}
      </p>

      {/* Location & Experience */}
      <div className="mb-4 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2 border-y border-slate-50 py-2.5">
        <div className="flex items-center gap-1">
          <MapPin size={13} className="text-slate-400" />
          <span className="truncate">{worker.city || 'Local Area'}</span>
        </div>

        <div className="flex items-center gap-1">
          <Clock size={13} className="text-slate-400" />
          <span>{worker.experience || 1}+ yrs exp</span>
        </div>
      </div>

      {/* Footer: Rating & Price */}
      <div className="mt-auto flex items-center justify-between pt-1">
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="text-sm font-bold text-slate-800">{Number(worker.rating || 0).toFixed(1)}</span>
          <span className="text-xs text-slate-400">({worker.reviewCount || 0})</span>
        </div>

        <div className="text-right">
          <span className="text-base font-extrabold text-blue-600">
            {formatCurrency(worker.pricePerDay || worker.price || 500)}
          </span>
          <span className="text-[11px] font-medium text-slate-400">/day</span>
        </div>
      </div>

      {/* Call to Action indicator */}
      <div className="mt-3 rounded-lg border border-dashed border-blue-200 bg-blue-50/50 py-1.5 text-center text-xs font-medium text-blue-600">
        {role === 'worker' ? 'Worker profile preview' : 'Click to view full profile & book'}
      </div>
    </div>
  );
}

export default WorkerCard;

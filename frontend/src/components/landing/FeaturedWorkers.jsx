import { useWorkers } from '../../hooks/useWorkers'
import { WorkerCard } from './WorkerCard'

export function FeaturedWorkers() {
  const { data: workers = [] } = useWorkers()

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Top Rated</p>
          <h2 className="text-3xl font-semibold text-slate-900">Featured workers this week</h2>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {workers.slice(0, 3).map((worker) => <WorkerCard key={worker.id} worker={worker} />)}
      </div>
    </section>
  )
}

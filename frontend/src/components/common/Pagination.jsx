export function Pagination({ page, setPage, totalPages }) {
  if (totalPages <= 1) return null

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button onClick={() => setPage(Math.max(page - 1, 1))} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">Prev</button>
      {Array.from({ length: totalPages }).map((_, index) => (
        <button key={index} onClick={() => setPage(index + 1)} className={`rounded-lg px-3 py-2 text-sm ${page === index + 1 ? 'bg-secondary text-white' : 'border border-slate-200 text-slate-700'}`}>
          {index + 1}
        </button>
      ))}
      <button onClick={() => setPage(Math.min(page + 1, totalPages))} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">Next</button>
    </div>
  )
}

export function UserProfileEdit() {
  return (
    <div className="card space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
        <input className="input-field" defaultValue="Guest User" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Mobile</label>
        <input className="input-field" defaultValue="9876543210" disabled />
      </div>
      <button className="btn-primary">Save</button>
    </div>
  )
}

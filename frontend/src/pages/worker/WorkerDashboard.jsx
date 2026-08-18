import { useState } from 'react'
import { MoreVertical, Pencil, MapPin, BriefcaseBusiness, IndianRupee, CalendarDays } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { Navbar } from '../../components/common/Navbar'
import { DashboardStats } from '../../components/dashboard/worker/DashboardStats'
import { ProfileEditForm } from '../../components/dashboard/worker/ProfileEditForm'
import { Modal } from '../../components/common/Modal'
import { getProfileViewers, getReceivedReviews } from '../../api/workerApi'

export default function WorkerDashboard() {
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()
  const [isEditingProfile, setIsEditingProfile] = useState(!user?.profileCompleted)
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)
  const [detailType, setDetailType] = useState(null)
  const [detailItems, setDetailItems] = useState([])
  const [detailsLoading, setDetailsLoading] = useState(false)

  const handleStatClick = async (type) => {
    if (type === 'bookings') {
      navigate('/dashboard/worker/bookings')
      return
    }

    setDetailType(type)
    setDetailsLoading(true)
    setDetailItems([])
    try {
      const response = type === 'viewers' ? await getProfileViewers() : await getReceivedReviews()
      setDetailItems(response?.data || response || [])
    } catch {
      setDetailItems([])
    } finally {
      setDetailsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-lg font-semibold text-slate-900">Hello, {user?.name || 'Worker'}!</div>
        </div>
        <div className="mx-auto max-w-2xl space-y-6">
            {isEditingProfile ? (
              <ProfileEditForm onSaved={() => setIsEditingProfile(false)} />
            ) : (
              <section className="card relative overflow-visible">
                <div className="absolute right-4 top-4">
                  <button
                    type="button"
                    onClick={() => setMoreMenuOpen((open) => !open)}
                    className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    aria-label="More profile options"
                    aria-expanded={moreMenuOpen}
                  >
                    <MoreVertical size={20} />
                  </button>
                  {moreMenuOpen && (
                    <div className="absolute right-0 top-10 z-10 w-52 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                      <button
                        type="button"
                        onClick={() => {
                          setMoreMenuOpen(false)
                          setIsEditingProfile(true)
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <Pencil size={16} />
                        Edit profile details
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-4 pr-10">
                  {user?.photo ? (
                    <img src={user.photo} alt={user.name} className="h-20 w-20 rounded-full object-cover ring-4 ring-slate-100" />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-2xl font-bold text-slate-500">
                      {user?.name?.charAt(0)?.toUpperCase() || 'W'}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h2 className="text-xl font-bold text-slate-900">{user?.name || 'Worker profile'}</h2>
                    <p className="mt-1 flex items-center gap-1 text-sm font-medium text-indigo-600"><BriefcaseBusiness size={15} /> {user?.category || 'Others'}</p>
                    <p className="mt-1 flex items-center gap-1 text-sm text-slate-500"><MapPin size={15} /> {[user?.city, user?.state].filter(Boolean).join(', ') || 'Location not added'}</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Daily rate</p>
                    <p className="mt-1 flex items-center text-sm font-semibold text-slate-800"><IndianRupee size={14} />{user?.pricePerDay || user?.price || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Experience</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{user?.experience || 0} years</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">About</p>
                    <p className="mt-1 text-sm leading-5 text-slate-600">{user?.bio || 'No bio added yet.'}</p>
                  </div>
                </div>
                <div className="mt-4 rounded-xl bg-slate-50 p-3">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500"><CalendarDays size={15} /> Availability</p>
                  <p className={`mt-2 text-sm font-semibold ${user?.availability?.isAvailableNow === false ? 'text-amber-700' : 'text-emerald-700'}`}>
                    {user?.availability?.isAvailableNow === false ? 'Currently unavailable' : 'Available now'}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {(user?.availability?.days?.length ? user.availability.days : ['Mon', 'Tue', 'Wed']).join(', ')}
                  </p>
                </div>
              </section>
            )}
          {!isEditingProfile && <DashboardStats onStatClick={handleStatClick} />}
        </div>
      </div>
      <Modal open={Boolean(detailType)} onClose={() => setDetailType(null)} title={detailType === 'viewers' ? 'People who viewed your profile' : 'Ratings and reviews'}>
        {detailsLoading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : detailItems.length === 0 ? (
          <p className="text-sm text-slate-500">{detailType === 'viewers' ? 'No signed-in users have viewed your profile yet.' : 'You have not received any ratings yet.'}</p>
        ) : (
          <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
            {detailItems.map((item) => {
              const person = detailType === 'viewers' ? item.user : item.user
              return (
                <div key={item._id || person?._id} className="flex items-start gap-3 rounded-xl border border-slate-100 p-3">
                  {person?.photo ? (
                    <img src={person.photo} alt={person.name} className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-500">{person?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800">{person?.name || 'User'}</p>
                    {detailType === 'viewers' ? (
                      <p className="text-sm text-slate-500">Viewed {item.viewedAt ? new Date(item.viewedAt).toLocaleDateString() : 'recently'}</p>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-amber-600">{'★'.repeat(item.rating || 0)}{'☆'.repeat(5 - (item.rating || 0))}</p>
                        <p className="mt-1 text-sm text-slate-600">{item.comment}</p>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Modal>
    </div>
  )
}

import { useState } from 'react'
import { BriefcaseBusiness, Camera, MessageCircle, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export function Footer() {
  const [activeModal, setActiveModal] = useState(null)
  const role = useAuthStore((state) => state.role)

  const content = {
    about: {
      title: 'About WorkerLink',
      body: 'WorkerLink helps users quickly discover trusted local service professionals and book them with confidence.',
    },
    privacy: {
      title: 'Privacy Policy',
      body: 'We respect your privacy. Your personal details are used only to facilitate bookings and account access.',
    },
    terms: {
      title: 'Terms & Conditions',
      body: 'By using WorkerLink, you agree to use the platform responsibly and provide accurate booking information.',
    },
  }

  return (
    <>
    <footer id="contact" className="border-t border-slate-200 bg-slate-950 py-12 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <div className="mb-4 text-xl font-semibold text-white">WorkerLink</div>
          <p className="max-w-sm text-sm">Find trusted local workers instantly, from plumbers to cleaners and skilled service professionals.</p>
        </div>
        <div>
          <div className="mb-4 font-semibold text-white">Quick Links</div>
          <div className="flex flex-col gap-2 text-sm">
            <button type="button" onClick={() => setActiveModal('about')} className="text-left hover:text-white">About</button>
            <button type="button" onClick={() => setActiveModal('privacy')} className="text-left hover:text-white">Privacy Policy</button>
            <button type="button" onClick={() => setActiveModal('terms')} className="text-left hover:text-white">Terms</button>
            <a href="#contact" className="hover:text-white">Contact</a>
          </div>
        </div>
        <div>
          <div className="mb-4 font-semibold text-white">Follow Us</div>
          <div className="flex gap-3">
            <a href="https://instagram.com" className="rounded-full border border-slate-700 p-2 hover:border-primary" aria-label="Instagram"><Camera size={16} /></a>
            <a href="https://linkedin.com" className="rounded-full border border-slate-700 p-2 hover:border-primary" aria-label="LinkedIn"><BriefcaseBusiness size={16} /></a>
            <a href="https://x.com" className="rounded-full border border-slate-700 p-2 hover:border-primary" aria-label="X"><MessageCircle size={16} /></a>
          </div>
          {role !== 'worker' && (
            <Link to="/auth" className="btn-primary mt-6 inline-flex">Join as Worker</Link>
          )}
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-slate-800 px-4 pt-6 text-center text-sm sm:px-6 lg:px-8">(c) 2026 WorkerLink. All rights reserved.</div>
    </footer>

    {activeModal && (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 text-slate-800 shadow-2xl">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h3 className="text-lg font-semibold">{content[activeModal].title}</h3>
            <button type="button" onClick={() => setActiveModal(null)} className="rounded-full p-1 text-slate-500 hover:bg-slate-100">
              <X size={18} />
            </button>
          </div>
          <p className="text-sm leading-6 text-slate-600">{content[activeModal].body}</p>
          <button type="button" onClick={() => setActiveModal(null)} className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">
            Close
          </button>
        </div>
      </div>
    )}
    </>
  )
}

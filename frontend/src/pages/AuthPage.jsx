import { useState } from 'react'
import { LoginForm } from '../components/auth/LoginForm'
import { SignupForm } from '../components/auth/SignupForm'
import { Navbar } from '../components/common/Navbar'

export default function AuthPage() {
  const [tab, setTab] = useState('login')

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-lg px-4 py-12 sm:py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-primary/10 sm:p-8">
          <div className="mb-7 text-center"><h1 className="text-3xl font-bold text-slate-900">Worker<span className="text-primary">Link</span></h1><p className="mt-2 text-sm text-slate-600">Connect with skilled workers near you.</p></div>
          <div className="mb-6 flex gap-2 rounded-full bg-slate-100 p-1">
            <button onClick={() => setTab('login')} className={`flex-1 rounded-full px-4 py-2 text-sm font-medium ${tab === 'login' ? 'bg-white text-primary shadow' : 'text-slate-600'}`}>Login</button>
            <button onClick={() => setTab('signup')} className={`flex-1 rounded-full px-4 py-2 text-sm font-medium ${tab === 'signup' ? 'bg-white text-primary shadow' : 'text-slate-600'}`}>Sign Up</button>
          </div>
          {tab === 'login' ? <LoginForm /> : <SignupForm onGoToLogin={() => setTab('login')} />}
          <p className="mt-6 text-sm text-slate-600">By continuing you agree to our terms and privacy policy.</p>
        </div>
      </main>
    </div>
  )
}

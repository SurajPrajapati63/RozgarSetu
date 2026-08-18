import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, LoaderCircle, UserRound, Wrench } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { signupSchema } from '../../utils/validators'
import { signupUser, signupWorker } from '../../api/authApi'
import { useAuthStore } from '../../store/authStore'
import { WorkerIDSuccess } from './WorkerIDSuccess'
import toast from 'react-hot-toast'

export function SignupForm({ onGoToLogin }) {
  const [role, setRole] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [workerID, setWorkerID] = useState(null)
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(signupSchema) })
  const onSubmit = async (values) => {
    try {
      if (role === 'user') {
        const response = await signupUser(values)
        setAuth(response.data.user, response.data.token)
        toast.success('Account created successfully')
        navigate('/', { replace: true })
      } else {
        const response = await signupWorker(values)
        setWorkerID(response.data.workerID)
      }
    } catch (error) { toast.error(error.response?.data?.message || 'Could not create account') }
  }
  if (workerID) return <WorkerIDSuccess workerID={workerID} onLogin={onGoToLogin} />
  if (!role) return <div className="space-y-4"><p className="text-center text-sm text-slate-600">Choose how you want to use RozgarSetu.</p><div className="grid gap-3 sm:grid-cols-2">{[{ id: 'user', label: 'User', text: 'Find and hire trusted workers', Icon: UserRound }, { id: 'worker', label: 'Worker', text: 'Offer your services locally', Icon: Wrench }].map(({ id, label, text, Icon }) => <button type="button" key={id} onClick={() => setRole(id)} className="rounded-2xl border border-slate-200 p-5 text-left transition hover:border-primary hover:bg-primary/5"><Icon className="mb-3 text-primary" /><h2 className="font-semibold text-slate-900">{label}</h2><p className="mt-1 text-sm text-slate-600">{text}</p></button>)}</div></div>
  return <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}><button type="button" onClick={() => setRole(null)} className="text-sm font-medium text-primary">← Change role</button><p className="text-lg font-semibold text-slate-900">Create {role === 'user' ? 'user' : 'worker'} account</p><div><label className="mb-1.5 block text-sm font-medium text-slate-700">Name</label><input {...register('name')} className="input-field" />{errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}</div><div><label className="mb-1.5 block text-sm font-medium text-slate-700">Mobile</label><input {...register('mobile')} className="input-field" />{errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile.message}</p>}</div><div><label className="mb-1.5 block text-sm font-medium text-slate-700">Address</label><textarea {...register('address')} className="input-field min-h-20" />{errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}</div><div><label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label><div className="relative"><input type={showPassword ? 'text' : 'password'} {...register('password')} className="input-field pr-12" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 text-slate-500">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>{errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}</div><div><label className="mb-1.5 block text-sm font-medium text-slate-700">Confirm password</label><input type={showPassword ? 'text' : 'password'} {...register('confirmPassword')} className="input-field" />{errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}</div><button type="submit" disabled={isSubmitting} className="btn-primary flex w-full items-center justify-center gap-2 disabled:opacity-70">{isSubmitting && <LoaderCircle className="animate-spin" size={18} />} Create Account</button></form>
}

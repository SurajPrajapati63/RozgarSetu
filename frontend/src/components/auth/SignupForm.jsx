import { useState, useEffect, useRef, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, LoaderCircle, UserRound, Wrench, Search, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { signupSchema } from '../../utils/validators'
import { signupUser, signupWorker } from '../../api/authApi'
import { getAutocompleteSuggestions, getPlaceDetails } from '../../api/placesApi'
import { useAuthStore } from '../../store/authStore'
import { WorkerIDSuccess } from './WorkerIDSuccess'
import toast from 'react-hot-toast'

function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

function LocationSearch({ onSelect }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const wrapperRef = useRef(null)
  const debouncedQuery = useDebounce(query)

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 3) {
      setSuggestions([])
      return
    }
    let cancelled = false
    setLoading(true)
    getAutocompleteSuggestions(debouncedQuery, '(regions)').then((results) => {
      if (!cancelled) {
        setSuggestions(results)
        setShowDropdown(results.length > 0)
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [debouncedQuery])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = useCallback(async (suggestion) => {
    setShowDropdown(false)
    setQuery(suggestion.description)
    const details = await getPlaceDetails(suggestion.placeId)
    if (details) {
      onSelect(details)
    }
  }, [onSelect])

  return (
    <div ref={wrapperRef} className="relative">
      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
        <Search size={14} /> Search Location
      </label>
      <input
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setShowDropdown(true) }}
        onFocus={() => { if (suggestions.length > 0) setShowDropdown(true) }}
        placeholder="Type to search your location..."
        className="input-field"
      />
      {loading && <div className="absolute right-3 top-[38px]"><LoaderCircle className="animate-spin text-primary" size={16} /></div>}
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
          {suggestions.map((s) => (
            <li
              key={s.placeId}
              onClick={() => handleSelect(s)}
              className="flex cursor-pointer items-center gap-2 px-3 py-2.5 text-sm hover:bg-primary/5"
            >
              <MapPin size={14} className="shrink-0 text-primary" />
              <div>
                <span className="font-medium text-slate-900">{s.mainText}</span>
                {s.secondaryText && <span className="ml-1 text-slate-500">{s.secondaryText}</span>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function SignupForm({ onGoToLogin }) {
  const [role, setRole] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [workerID, setWorkerID] = useState(null)
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(signupSchema) })

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

  const handleLocationSelect = useCallback((details) => {
    if (details.country) setValue('country', details.country, { shouldValidate: true })
    if (details.state) setValue('state', details.state, { shouldValidate: true })
    if (details.district) setValue('district', details.district, { shouldValidate: true })
    if (details.city) setValue('city', details.city, { shouldValidate: true })
    if (details.pincode) setValue('pincode', details.pincode, { shouldValidate: true })
  }, [setValue])

  if (workerID) return <WorkerIDSuccess workerID={workerID} onLogin={onGoToLogin} />

  if (!role) return (
    <div className="space-y-4">
      <p className="text-center text-sm text-slate-600">Choose how you want to use RozgarSetu.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { id: 'user', label: 'User', text: 'Find and hire trusted workers', Icon: UserRound },
          { id: 'worker', label: 'Worker', text: 'Offer your services locally', Icon: Wrench },
        ].map(({ id, label, text, Icon }) => (
          <button
            type="button"
            key={id}
            onClick={() => setRole(id)}
            className="rounded-2xl border border-slate-200 p-5 text-left transition hover:border-primary hover:bg-primary/5"
          >
            <Icon className="mb-3 text-primary" />
            <h2 className="font-semibold text-slate-900">{label}</h2>
            <p className="mt-1 text-sm text-slate-600">{text}</p>
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <button type="button" onClick={() => setRole(null)} className="text-sm font-medium text-primary">← Change role</button>
      <p className="text-lg font-semibold text-slate-900">Create {role === 'user' ? 'user' : 'worker'} account</p>

      {/* Name */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Name</label>
        <input {...register('name')} className="input-field" />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      {/* Mobile */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Mobile</label>
        <input {...register('mobile')} className="input-field" />
        {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile.message}</p>}
      </div>

      {/* Location Search */}
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-3">
        <LocationSearch onSelect={handleLocationSelect} />
        <p className="mt-1.5 text-xs text-slate-400">Search to auto-fill location fields below, or enter manually.</p>
      </div>

      {/* Country & State */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Country</label>
          <input {...register('country')} placeholder="e.g. India" className="input-field" />
          {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">State</label>
          <input {...register('state')} placeholder="e.g. Maharashtra" className="input-field" />
          {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>}
        </div>
      </div>

      {/* District & City */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">District</label>
          <input {...register('district')} placeholder="e.g. Pune" className="input-field" />
          {errors.district && <p className="mt-1 text-sm text-red-600">{errors.district.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">City</label>
          <input {...register('city')} placeholder="e.g. Pune" className="input-field" />
          {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
        </div>
      </div>

      {/* Pincode */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Pincode</label>
        <input {...register('pincode')} placeholder="e.g. 411001" className="input-field" />
        {errors.pincode && <p className="mt-1 text-sm text-red-600">{errors.pincode.message}</p>}
      </div>

      {/* Password */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
        <div className="relative">
          <input type={showPassword ? 'text' : 'password'} {...register('password')} className="input-field pr-12" />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 text-slate-500">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Confirm password</label>
        <input type={showPassword ? 'text' : 'password'} {...register('confirmPassword')} className="input-field" />
        {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary flex w-full items-center justify-center gap-2 disabled:opacity-70">
        {isSubmitting && <LoaderCircle className="animate-spin" size={18} />} Create Account
      </button>
    </form>
  )
}

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LoaderCircle, User, Wrench, Shield } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { userLoginSchema, workerLoginSchema, identifierLoginSchema } from '../../utils/validators';
import { loginUser, loginWorker, loginWithIdentifier } from '../../api/authApi';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export function LoginForm() {
  const [subTab, setSubTab] = useState('user'); // 'user' | 'worker'
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect');

  const setAuth = useAuthStore((state) => state.setAuth);

  const activeSchema = subTab === 'user' ? userLoginSchema : workerLoginSchema;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(activeSchema)
  });

  const handleSubTabChange = (type) => {
    // Prevent selecting admin since admin login is removed
    if (type === 'admin') return;
    setSubTab(type);
    reset();
  };

  const onSubmit = async (values) => {
    try {
      let response;
      if (subTab === 'user') {
        response = await loginUser(values);
      } else if (subTab === 'worker') {
        response = await loginWorker(values);
      } else {
        response = await loginWithIdentifier(values);
      }

      const userData = response.data.user || response.data.worker || response.data.admin;
      const token = response.data.token || response.data.accessToken;

      setAuth(userData, token);
      toast.success(`Welcome back, ${userData?.name || 'User'}!`);

      if (redirectPath) {
        navigate(redirectPath, { replace: true });
      } else if (userData?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (userData?.role === 'worker') {
        navigate('/dashboard/worker', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || error.response?.data?.errors?.[0]?.message || 'Invalid login credentials';
      toast.error(errMsg);
    }
  };

  return (
    <div className="space-y-5">
      {/* Sub-tabs */}
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 text-xs font-semibold text-slate-600">
        <button
          type="button"
          onClick={() => handleSubTabChange('user')}
          className={`flex items-center justify-center gap-1.5 rounded-lg py-2 transition-all ${
            subTab === 'user' ? 'bg-white text-blue-600 shadow-sm' : 'hover:text-slate-900'
          }`}
        >
          <User size={14} /> User Login
        </button>
        <button
          type="button"
          onClick={() => handleSubTabChange('worker')}
          className={`flex items-center justify-center gap-1.5 rounded-lg py-2 transition-all ${
            subTab === 'worker' ? 'bg-white text-blue-600 shadow-sm' : 'hover:text-slate-900'
          }`}
        >
          <Wrench size={14} /> Worker Login
        </button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {subTab === 'user' && (
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Mobile Number
            </label>
            <input
              type="text"
              placeholder="10 digit mobile number"
              maxLength={10}
              {...register('mobile')}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            {errors.mobile && <p className="mt-1 text-xs font-medium text-red-600">{errors.mobile.message}</p>}
          </div>
        )}

        {subTab === 'worker' && (
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Worker ID
            </label>
            <input
              type="text"
              placeholder="e.g. WRK-2026-0001"
              {...register('workerID')}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-mono outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            {errors.workerID && <p className="mt-1 text-xs font-medium text-red-600">{errors.workerID.message}</p>}
          </div>
        )}

        {/* Admin login removed - only user and worker login supported */}

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password')}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 pr-11 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3.5 flex items-center text-slate-400 hover:text-slate-600"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs font-medium text-red-600">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-md transition-all hover:bg-blue-700 active:scale-[0.99] disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="animate-spin" size={18} /> Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;

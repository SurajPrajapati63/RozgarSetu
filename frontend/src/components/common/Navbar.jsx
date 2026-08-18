import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, Calendar, Shield, ChevronDown, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const { user, token, role, isAuthenticated, clearAuth } = useAuthStore();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearAuth();
    setDropdownOpen(false);
    navigate('/');
  };

  const handleWorkerHome = () => {
    setMobileOpen(false);
    navigate('/');
  };

  const getDashboardPath = () => {
    if (role === 'worker') return '/dashboard/worker';
    if (role === 'admin') return '/admin';
    return '/dashboard/user';
  };
  const isWorker = role === 'worker';

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="WorkerLink" className="h-10 w-auto origin-left scale-200 object-contain" />
        </Link>

        {/* Center Navigation Links */}
        {!isWorker && <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <Link to="/" className="transition-colors hover:text-blue-600">Home</Link>
          <a href="#browse-workers" className="transition-colors hover:text-blue-600">Browse Workers</a>
          <a href="#how-it-works" className="transition-colors hover:text-blue-600">How It Works</a>
          <a href="#contact" className="transition-colors hover:text-blue-600">Contact</a>
        </nav>}
        {isWorker && <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <button type="button" onClick={handleWorkerHome} className="transition-colors hover:text-blue-600">Home</button>
        </nav>}

        {/* Right Action Buttons */}
        <div className="hidden items-center gap-4 md:flex">
          {!isAuthenticated ? (
            <>
              <Link 
                to="/auth?tab=login" 
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:border-slate-400"
              >
                Login
              </Link>
              <Link 
                to="/auth?tab=signup&role=worker" 
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow"
              >
                Join as Worker
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {role === 'user' && (
                <Link
                  to="/dashboard/user"
                  className="flex items-center gap-2 rounded-lg bg-blue-50 px-3.5 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
                >
                  <Calendar size={16} /> My Bookings
                </Link>
              )}

              {role === 'worker' && (
                <Link
                  to="/dashboard/worker"
                  className="flex items-center gap-2 rounded-lg bg-blue-50 px-3.5 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
                >
                  <LayoutDashboard size={16} /> My Dashboard
                </Link>
              )}

              {role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 rounded-lg bg-purple-50 px-3.5 py-2 text-sm font-medium text-purple-600 transition-colors hover:bg-purple-100"
                >
                  <Shield size={16} /> Admin Panel
                </Link>
              )}

              {/* User Avatar & Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 p-1 pr-2 transition-all hover:border-slate-300"
                >
                  {user?.photo ? (
                    <img src={user.photo} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-slate-700 max-w-[100px] truncate">{user?.name || 'Account'}</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-100 bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="border-b border-slate-100 px-3 py-2">
                      <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 capitalize">{role} Account</p>
                    </div>

                    <Link
                      to={getDashboardPath()}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg border border-slate-200 p-2 text-slate-700 md:hidden"
          aria-label="Open Mobile Menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm md:hidden">
          <div className="fixed inset-y-0 right-0 w-80 bg-white p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <img src="/logo.png" alt="WorkerLink" className="h-8 w-auto origin-left scale-200 object-contain" />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              {!isWorker && <div className="mt-6 flex flex-col gap-4 text-base font-medium text-slate-700">
                <Link to="/" onClick={() => setMobileOpen(false)} className="hover:text-blue-600">Home</Link>
                <a href="#browse-workers" onClick={() => setMobileOpen(false)} className="hover:text-blue-600">Browse Workers</a>
                <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="hover:text-blue-600">How It Works</a>
                <a href="#contact" onClick={() => setMobileOpen(false)} className="hover:text-blue-600">Contact</a>
              </div>}
              {isWorker && <div className="mt-6 flex flex-col gap-4 text-base font-medium text-slate-700">
                <button type="button" onClick={handleWorkerHome} className="text-left hover:text-blue-600">Home</button>
              </div>}
            </div>

            <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/auth?tab=login"
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center rounded-lg border border-slate-300 py-2.5 font-medium text-slate-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth?tab=signup&role=worker"
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center rounded-lg bg-blue-600 py-2.5 font-medium text-white shadow-sm"
                  >
                    Join as Worker
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center rounded-lg bg-blue-50 py-2.5 font-medium text-blue-600"
                  >
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={() => { setMobileOpen(false); handleLogout(); }}
                    className="w-full text-center rounded-lg border border-red-200 py-2.5 font-medium text-red-600"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;

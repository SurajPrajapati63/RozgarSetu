import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('wl_user') || 'null'),
  token: localStorage.getItem('wl_token') || null,
  role: JSON.parse(localStorage.getItem('wl_user') || 'null')?.role || null,
  isAuthenticated: !!(localStorage.getItem('wl_token') && localStorage.getItem('wl_user')),

  setAuth: (user, token) => {
    localStorage.setItem('wl_token', token);
    localStorage.setItem('wl_user', JSON.stringify(user));
    set({
      user,
      token,
      role: user?.role || null,
      isAuthenticated: true
    });
  },

  clearAuth: () => {
    localStorage.removeItem('wl_token');
    localStorage.removeItem('wl_user');
    set({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false
    });
  },

  updateUser: (partialUser) => {
    set((state) => {
      const updated = state.user ? { ...state.user, ...partialUser } : null;
      if (updated) {
        localStorage.setItem('wl_user', JSON.stringify(updated));
      }
      return { user: updated };
    });
  }
}));

export default useAuthStore;

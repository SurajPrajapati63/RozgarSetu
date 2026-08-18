import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isAuthModalOpen: false,
  authModalTab: 'login', // 'login' | 'signup'
  authModalRole: 'user', // 'user' | 'worker'

  filters: {
    category: 'All',
    city: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    sort: 'newest'
  },

  openAuthModal: (tab = 'login', role = 'user') => set({ isAuthModalOpen: true, authModalTab: tab, authModalRole: role }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  setFilter: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),
  resetFilters: () => set({
    filters: {
      category: 'All',
      city: '',
      search: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      sort: 'newest'
    }
  })
}));

export default useUIStore;

export const ROLES = {
  USER: 'user',
  WORKER: 'worker',
  ADMIN: 'admin',
}

export const BOOKING_STATUS = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

export const WORKER_CATEGORIES = ['Plumber', 'Electrician', 'Carpenter', 'Painter', 'AC Repair', 'Cleaning', 'Driver', 'Cook', 'Security Guard', 'Others']
export const SERVICE_AREAS = ['Lucknow', 'Noida', 'Delhi', 'Gurugram', 'Kanpur', 'Jaipur', 'Mumbai', 'Bengaluru']
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export const MOCK_WORKERS = [
  {
    _id: '507f1f77bcf86cd799439011',
    id: '507f1f77bcf86cd799439011',
    name: 'Aman Verma',
    category: 'Plumber',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    rating: 4.8,
    reviews: 128,
    price: 450,
    verified: true,
    available: true,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    description: 'Trusted plumber for leak repair, bathroom fittings and emergency services.',
    skills: ['Leak Repair', 'Bathroom Fitting', 'Pipe Installation'],
    status: 'active',
  },
  {
    _id: '507f1f77bcf86cd799439012',
    id: '507f1f77bcf86cd799439012',
    name: 'Riya Singh',
    category: 'Electrician',
    city: 'Noida',
    state: 'Uttar Pradesh',
    rating: 4.7,
    reviews: 96,
    price: 500,
    verified: false,
    available: false,
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    description: 'Fast wiring, fan fitting and electrical panel support.',
    skills: ['Wiring', 'Fan Fitting', 'Switch Boards'],
    status: 'active',
  },
  {
    _id: '507f1f77bcf86cd799439013',
    id: '507f1f77bcf86cd799439013',
    name: 'Deepak Sharma',
    category: 'Carpenter',
    city: 'Delhi',
    state: 'Delhi',
    rating: 4.9,
    reviews: 214,
    price: 620,
    verified: true,
    available: true,
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    description: 'Custom furniture, modular installation and woodwork.',
    skills: ['Furniture', 'Wardrobe', 'Door Fixing'],
    status: 'pending',
  },
]

export const MOCK_BOOKINGS = [
  {
    id: 'BK-101',
    userName: 'Nisha Rao',
    workerName: 'Aman Verma',
    service: 'Leak repair',
    date: '2026-06-28',
    price: 450,
    status: BOOKING_STATUS.PENDING,
  },
  {
    id: 'BK-102',
    userName: 'Vikram S.',
    workerName: 'Aman Verma',
    service: 'Bathroom fitting',
    date: '2026-06-30',
    price: 680,
    status: BOOKING_STATUS.ACCEPTED,
  },
]

import { Suspense, lazy, useCallback, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { Loader } from './components/common/Loader'
import { ProtectedRoute } from './components/common/ProtectedRoute'
import { useAuthStore } from './store/authStore'
import { SplashScreen } from './components/common/SplashScreen'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const WorkerPublicProfile = lazy(() => import('./pages/worker/WorkerPublicProfile'))
const UserDashboard = lazy(() => import('./pages/user/UserDashboard'))
const UserBookings = lazy(() => import('./pages/user/UserBookings'))
const UserSettings = lazy(() => import('./pages/user/UserSettings'))
const WorkerDashboard = lazy(() => import('./pages/worker/WorkerDashboard'))
const WorkerPosts = lazy(() => import('./pages/worker/WorkerPosts'))
const WorkerBookings = lazy(() => import('./pages/worker/WorkerBookings'))
const WorkerEarnings = lazy(() => import('./pages/worker/WorkerEarnings'))
const WorkerSettings = lazy(() => import('./pages/worker/WorkerSettings'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminWorkers = lazy(() => import('./pages/admin/AdminWorkers'))
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'))
const AdminBookings = lazy(() => import('./pages/admin/AdminBookings'))
const AdminPosts = lazy(() => import('./pages/admin/AdminPosts'))
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))
const NotFoundPage = lazy(() => import('./pages/misc/NotFoundPage'))
const UnauthorizedPage = lazy(() => import('./pages/misc/UnauthorizedPage'))

function PublicWorkerProfileRoute() {
  const role = useAuthStore((state) => state.role)
  return role === 'worker' ? <Navigate to="/dashboard/worker" replace /> : <WorkerPublicProfile />
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function AppRoutes() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const role = useAuthStore((state) => state.role)

  const dashboardPath = role === 'admin' ? '/admin' : role === 'worker' ? '/dashboard/worker' : '/dashboard/user'

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={isAuthenticated ? <Navigate to={dashboardPath} replace /> : <AuthPage />} />
      <Route path="/worker/:id" element={<PublicWorkerProfileRoute />} />
      <Route path="/dashboard/user" element={<ProtectedRoute allowedRoles={['user']}><UserDashboard /></ProtectedRoute>} />
      <Route path="/dashboard/user/bookings" element={<ProtectedRoute allowedRoles={['user']}><UserBookings /></ProtectedRoute>} />
      <Route path="/dashboard/user/settings" element={<ProtectedRoute allowedRoles={['user']}><UserSettings /></ProtectedRoute>} />
      <Route path="/dashboard/worker" element={<ProtectedRoute allowedRoles={['worker']}><WorkerDashboard /></ProtectedRoute>} />
      <Route path="/dashboard/worker/posts" element={<ProtectedRoute allowedRoles={['worker']}><WorkerPosts /></ProtectedRoute>} />
      <Route path="/dashboard/worker/bookings" element={<ProtectedRoute allowedRoles={['worker']}><WorkerBookings /></ProtectedRoute>} />
      <Route path="/dashboard/worker/earnings" element={<ProtectedRoute allowedRoles={['worker']}><WorkerEarnings /></ProtectedRoute>} />
      <Route path="/dashboard/worker/settings" element={<ProtectedRoute allowedRoles={['worker']}><WorkerSettings /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/workers" element={<ProtectedRoute allowedRoles={['admin']}><AdminWorkers /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/bookings" element={<ProtectedRoute allowedRoles={['admin']}><AdminBookings /></ProtectedRoute>} />
      <Route path="/admin/posts" element={<ProtectedRoute allowedRoles={['admin']}><AdminPosts /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin']}><AdminAnalytics /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminSettings /></ProtectedRoute>} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

function App() {
  const [loading, setLoading] = useState(true)
  const finishLoading = useCallback(() => setLoading(false), [])

  if (loading) return <SplashScreen onFinish={finishLoading} />

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<Loader />}> 
          <AppRoutes />
        </Suspense>
        <Toaster position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App

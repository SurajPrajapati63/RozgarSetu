import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Share2, Star, MapPin, Calendar as CalendarIcon, Phone, Clock, ShieldCheck } from 'lucide-react';
import { getWorkerById } from '../../api/workerApi';
import { getWorkerPosts } from '../../api/postApi';
import { getWorkerReviews, getWorkerRatingSummary } from '../../api/reviewApi';
import { createBooking } from '../../api/bookingApi';
import { useAuthStore } from '../../store/authStore';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { Loader } from '../../components/common/Loader';
import { Modal } from '../../components/common/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function WorkerPublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, role } = useAuthStore();

  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
  const [photoError, setPhotoError] = useState(false);

  // Form states for booking
  const [serviceDate, setServiceDate] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  // Queries
  const { data: workerResponse, isLoading: workerLoading } = useQuery({
    queryKey: ['worker', id],
    queryFn: () => getWorkerById(id)
  });
  const worker = workerResponse?.data;
  const resolvedWorkerId = worker?._id || worker?.id || id;

  const { data: postsResponse } = useQuery({
    queryKey: ['workerPosts', resolvedWorkerId],
    queryFn: () => getWorkerPosts(resolvedWorkerId),
    enabled: Boolean(resolvedWorkerId)
  });
  const posts = postsResponse?.data || [];

  const { data: reviewsResponse } = useQuery({
    queryKey: ['workerReviews', resolvedWorkerId],
    queryFn: () => getWorkerReviews(resolvedWorkerId),
    enabled: Boolean(resolvedWorkerId)
  });
  const reviews = reviewsResponse?.data || [];

  const { data: ratingSummaryResponse } = useQuery({
    queryKey: ['workerRatingSummary', resolvedWorkerId],
    queryFn: () => getWorkerRatingSummary(resolvedWorkerId),
    enabled: Boolean(resolvedWorkerId)
  });
  const ratingSummary = ratingSummaryResponse?.data || { averageRating: 0, totalReviews: 0, breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };

  // Booking Mutation
  const bookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: (res) => {
      toast.success(res.message || 'Booking request sent successfully!');
      setBookingModalOpen(false);
      setServiceDate('');
      setServiceDescription('');
      setContactNumber('');
      queryClient.invalidateQueries({ queryKey: ['userBookings'] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to submit booking request');
    }
  });

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate(`/auth?redirect=/worker/${id}`);
      return;
    }

    if (!serviceDate) return toast.error('Please select a service date');
    if (!serviceDescription || serviceDescription.length < 10) return toast.error('Please provide a description (min 10 chars)');
    if (!contactNumber || !/^\d{10}$/.test(contactNumber)) return toast.error('Please enter a valid 10-digit contact number');

    bookingMutation.mutate({
      workerId: resolvedWorkerId,
      serviceDate: new Date(serviceDate).toISOString(),
      serviceDescription,
      contactNumber,
      amount: Number(worker?.pricePerDay || 500)
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${worker?.name} - ${worker?.category} on WorkerLink`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Profile link copied to clipboard!');
    }
  };

  if (workerLoading) return <Loader message="Loading worker profile..." />;
  if (!worker) return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Worker Profile Not Found</h2>
        <p className="mt-2 text-sm text-slate-500">The requested profile might have been removed or is unavailable.</p>
        <button onClick={() => navigate('/')} className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white">
          Back to Home
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Left Column: Worker Header Card & Quick Info */}
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm text-center">
              <div className="relative mx-auto mb-4 flex justify-center">
                {worker.photo && !photoError ? (
                  <button
                    type="button"
                    onClick={() => setPhotoViewerOpen(true)}
                    className="group relative h-32 w-32 cursor-zoom-in overflow-hidden rounded-full border-4 border-slate-100 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    title="Click to view full photo"
                  >
                    <img
                      src={worker.photo}
                      alt={worker.name}
                      onError={() => setPhotoError(true)}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </button>
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-slate-100 text-3xl font-bold text-slate-500 border-4 border-slate-100 shadow-inner">
                    {worker.name?.charAt(0)?.toUpperCase() || 'W'}
                  </div>
                )}
              </div>

              <Modal open={photoViewerOpen} onClose={() => setPhotoViewerOpen(false)} title={`${worker.name}'s Profile Photo`}>
                {worker.photo && (
                  <div className="flex items-center justify-center p-2">
                    <img src={worker.photo} alt={worker.name} className="max-h-[75vh] w-full rounded-2xl object-contain shadow-lg" />
                  </div>
                )}
              </Modal>

              <div className="flex items-center justify-center gap-1.5">
                <h1 className="text-xl font-bold text-slate-900">{worker.name}</h1>
                <ShieldCheck className="h-5 w-5 text-blue-600" title="Verified Worker" />
              </div>

              <span className="mt-1 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                {worker.category || 'General Service'}
              </span>

              <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-slate-600">
                <MapPin size={16} className="text-slate-400" />
                <span>{worker.city || 'City'}, {worker.state || 'State'}</span>
              </div>

              <div className="mt-3 flex items-center justify-center gap-1 text-amber-500">
                <Star size={18} className="fill-amber-400" />
                <span className="text-base font-bold text-slate-900">{Number(worker.rating || 0).toFixed(1)}</span>
                <span className="text-xs text-slate-400">({worker.reviewCount || 0} reviews)</span>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">Daily Rate</div>
                <div className="text-2xl font-extrabold text-blue-600">{formatCurrency(worker.pricePerDay)}/day</div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate(`/auth?redirect=/worker/${id}`);
                      return;
                    }
                    setBookingModalOpen(true);
                  }}
                  className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
                >
                  Book Now
                </button>
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate(`/auth?redirect=/worker/${id}`);
                      return;
                    }
                    setContactModalOpen(true);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Phone size={16} /> Contact Details
                </button>
              </div>
            </div>

            {/* Skills & Experience */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Key Skills & Experience</h3>
              
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock size={16} className="text-slate-400" />
                <span>Experience: <strong className="text-slate-800">{worker.experience || 1} Years</strong></span>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {worker.skills && worker.skills.length > 0 ? (
                  worker.skills.map((skill, i) => (
                    <span key={i} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">No specific skills listed</span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Bio, Portfolio Posts, Reviews */}
          <div className="space-y-6 lg:col-span-2">
            
            {/* Bio Card */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-slate-900">About {worker.name}</h3>
                <button onClick={handleShare} className="rounded-full border border-slate-200 p-2 text-slate-500 hover:bg-slate-50">
                  <Share2 size={16} />
                </button>
              </div>
              <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line">
                {worker.bio || 'No detailed biography provided.'}
              </p>
            </div>

            {/* Work Portfolio (Posts) */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Work Portfolio ({posts.length})</h3>
              
              {posts.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No work portfolio items uploaded yet.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {posts.map((post) => (
                    <div key={post._id} className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                      {post.media && post.media.length > 0 && (
                        <img
                          src={post.media[0].url}
                          alt={post.title}
                          className="h-44 w-full object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h4 className="font-semibold text-slate-900 text-sm">{post.title}</h4>
                        <p className="mt-1 text-xs text-slate-600 line-clamp-2">{post.description}</p>
                        <span className="mt-2 inline-block text-[11px] font-medium text-slate-400">{formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reviews & Breakdown */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900">Client Reviews</h3>

              {/* Rating Summary */}
              <div className="flex flex-col sm:flex-row items-center gap-6 rounded-xl bg-slate-50 p-4 border border-slate-100">
                <div className="text-center sm:border-r border-slate-200 sm:pr-6">
                  <div className="text-4xl font-extrabold text-slate-900">{ratingSummary.averageRating}</div>
                  <div className="mt-1 flex justify-center text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} className={i < Math.round(ratingSummary.averageRating) ? 'fill-amber-400' : 'text-slate-300'} />
                    ))}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{ratingSummary.totalReviews} total reviews</div>
                </div>

                <div className="w-full flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = ratingSummary.breakdown[star] || 0;
                    const pct = ratingSummary.totalReviews > 0 ? (count / ratingSummary.totalReviews) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-3 text-xs">
                        <span className="w-8 font-medium text-slate-600">{star} star</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-6 text-right text-slate-400">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">No reviews yet for this worker.</p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev._id} className="border-b border-slate-100 pb-4 last:border-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-xs text-blue-600">
                            {rev.user?.name ? rev.user.name.charAt(0) : 'U'}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-800">{rev.user?.name || 'Anonymous User'}</div>
                            <div className="text-[11px] text-slate-400">{formatDate(rev.createdAt)}</div>
                          </div>
                        </div>
                        <div className="flex text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} size={14} className="fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Contact Details Modal */}
      <Modal open={contactModalOpen} onClose={() => setContactModalOpen(false)} title="Contact Information">
        <div className="space-y-4 text-slate-700">
          <p className="text-sm text-slate-600">Contact information for <strong>{worker.name}</strong>:</p>
          <div className="rounded-xl bg-slate-50 p-4 space-y-2.5 border border-slate-200 text-sm">
            <div><strong>Address / Location:</strong> {worker.address || `${worker.city}, ${worker.state}`}</div>
            <div>
              {/* <strong>Mobile:</strong>{' '}
              {worker.mobile ? (
                <span className="font-semibold text-slate-900">{worker.mobile}</span>
              ) : (
                <span className="text-amber-600 font-medium">Revealed after booking acceptance</span>
              )}
            </div>
            <div>
              <strong>Email:</strong>{' '}
              {worker.email ? (
                <span className="font-semibold text-slate-900">{worker.email}</span>
              ) : (
                <span className="text-amber-600 font-medium">Revealed after booking acceptance</span>
              )} */}
            </div>
          </div>

          {!worker.hasAcceptedBooking && !worker.mobile && (
            <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
              🔒 <strong>Privacy Note:</strong> Direct mobile number and email are unlocked once <strong>{worker.name}</strong> accepts your booking request.
            </div>
          )}

          <div className="flex gap-2">
            {!worker.hasAcceptedBooking && !worker.mobile && (
              <button
                onClick={() => {
                  setContactModalOpen(false);
                  setBookingModalOpen(true);
                }}
                className="w-1/2 rounded-xl bg-blue-600 py-2.5 font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                Book Worker Now
              </button>
            )}
            <button
              onClick={() => setContactModalOpen(false)}
              className={`${!worker.hasAcceptedBooking && !worker.mobile ? 'w-1/2' : 'w-full'} rounded-xl border border-slate-300 py-2.5 font-medium text-slate-700 hover:bg-slate-50`}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Book Now Modal */}
      <Modal open={bookingModalOpen} onClose={() => setBookingModalOpen(false)} title={`Book ${worker.name}`}>
        <form onSubmit={handleBookingSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Select Service Date
            </label>
            <input
              type="date"
              value={serviceDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setServiceDate(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Service Description
            </label>
            <textarea
              rows={3}
              value={serviceDescription}
              onChange={(e) => setServiceDescription(e.target.value)}
              placeholder="Describe the job required (e.g. Water leak repair in kitchen sink)..."
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Your Contact Number
            </label>
            <input
              type="text"
              maxLength={10}
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="10 digit mobile number"
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="rounded-xl bg-blue-50 p-3 text-xs text-blue-700 flex justify-between items-center">
            <span>Estimated Rate:</span>
            <strong className="text-sm">{formatCurrency(worker.pricePerDay)} / day</strong>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setBookingModalOpen(false)}
              className="w-1/2 rounded-xl border border-slate-300 py-2.5 font-medium text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={bookingMutation.isPending}
              className="w-1/2 rounded-xl bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-70"
            >
              {bookingMutation.isPending ? 'Sending...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </Modal>

      <Footer />
    </div>
  );
}

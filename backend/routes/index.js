import express from 'express';
import authRoutes from './auth.routes.js';
import workerRoutes from './worker.routes.js';
import postRoutes from './post.routes.js';
import bookingRoutes from './booking.routes.js';
import reviewRoutes from './review.routes.js';
import userRoutes from './user.routes.js';
import uploadRoutes from './upload.routes.js';
import adminRoutes from './admin.routes.js';
import placesRoutes from './places.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/workers', workerRoutes);
router.use('/posts', postRoutes);
router.use('/bookings', bookingRoutes);
router.use('/reviews', reviewRoutes);
router.use('/users', userRoutes);
router.use('/upload', uploadRoutes);
router.use('/admin', adminRoutes);
router.use('/places', placesRoutes);

export default router;

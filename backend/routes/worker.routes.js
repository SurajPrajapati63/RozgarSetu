import express from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import * as ctrl from '../controllers/worker.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';
import { uploadSingle } from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/', asyncHandler(ctrl.getAllWorkers));
router.get('/dashboard/stats', verifyToken, requireRole(['worker']), asyncHandler(ctrl.getDashboardStats));
router.get('/dashboard/profile-viewers', verifyToken, requireRole(['worker']), asyncHandler(ctrl.getProfileViewers));
router.get('/dashboard/reviews', verifyToken, requireRole(['worker']), asyncHandler(ctrl.getReceivedReviews));
router.get('/dashboard/me', verifyToken, requireRole(['worker']), asyncHandler(ctrl.getOwnProfile));

router.patch('/profile', verifyToken, requireRole(['worker']), asyncHandler(ctrl.updateProfile));
router.patch('/availability', verifyToken, requireRole(['worker']), asyncHandler(ctrl.updateAvailability));
router.post('/photo', verifyToken, requireRole(['worker']), uploadSingle, asyncHandler(ctrl.uploadProfilePhoto));
router.post('/profile-photo', verifyToken, requireRole(['worker']), uploadSingle, asyncHandler(ctrl.uploadProfilePhoto));
router.delete('/photo', verifyToken, requireRole(['worker']), asyncHandler(ctrl.removeProfilePhoto));

router.get('/:id', (req, res, next) => {
  // optional auth middleware pass-through
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) {
    return verifyToken(req, res, () => ctrl.getWorkerById(req, res, next));
  }
  return ctrl.getWorkerById(req, res, next);
});

export default router;

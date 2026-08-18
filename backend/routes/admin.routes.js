import express from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import * as ctrl from '../controllers/admin.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/stats', verifyToken, requireRole(['admin']), asyncHandler(ctrl.getStats));
router.get('/workers', verifyToken, requireRole(['admin']), asyncHandler(ctrl.getAllWorkers));
router.get('/workers/pending', verifyToken, requireRole(['admin']), asyncHandler(async (req,res)=>{ req.query.status='pending'; return ctrl.getAllWorkers(req,res); }));
router.patch('/workers/:id/approve', verifyToken, requireRole(['admin']), asyncHandler(ctrl.approveWorker));
router.patch('/workers/:id/reject', verifyToken, requireRole(['admin']), asyncHandler(ctrl.rejectWorker));
router.patch('/workers/:id/suspend', verifyToken, requireRole(['admin']), asyncHandler(ctrl.suspendWorker));
router.delete('/workers/:id', verifyToken, requireRole(['admin']), asyncHandler(ctrl.deleteWorker));
router.get('/users', verifyToken, requireRole(['admin']), asyncHandler(ctrl.getAllUsers));
router.patch('/users/:id/ban', verifyToken, requireRole(['admin']), asyncHandler(ctrl.banUser));
router.delete('/users/:id', verifyToken, requireRole(['admin']), asyncHandler(ctrl.deleteUser));
router.get('/bookings', verifyToken, requireRole(['admin']), asyncHandler(ctrl.getAllBookings));
router.get('/posts', verifyToken, requireRole(['admin']), asyncHandler(ctrl.getAllPosts));
router.patch('/posts/:id/status', verifyToken, requireRole(['admin']), asyncHandler(ctrl.updatePostStatus));
router.get('/analytics', verifyToken, requireRole(['admin']), asyncHandler(ctrl.getAnalyticsData));
router.get('/audit-logs', verifyToken, requireRole(['admin']), asyncHandler(ctrl.getAuditLogs));

export default router;

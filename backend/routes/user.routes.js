import express from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';
import User from '../controllers/user.controller.js';

const router = express.Router();

router.get('/me', verifyToken, requireRole(['user']), asyncHandler(User.getMe));
router.patch('/me', verifyToken, requireRole(['user']), asyncHandler(User.updateMe));
router.post('/me/photo', verifyToken, requireRole(['user']), asyncHandler(User.uploadPhoto));

export default router;

import express from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import * as ctrl from '../controllers/post.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';
import { uploadMultiple } from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/worker/:workerId', verifyToken, asyncHandler(ctrl.getWorkerPosts));
router.post('/', verifyToken, requireRole(['worker']), (req,res,next)=> uploadMultiple(req,res,(err)=>{ if(err) return next(err); next(); }), asyncHandler(ctrl.createPost));
router.patch('/:id', verifyToken, requireRole(['worker']), asyncHandler(ctrl.updatePost));
router.delete('/:id', verifyToken, requireRole(['worker']), asyncHandler(ctrl.deletePost));
router.patch('/:id/flag', verifyToken, requireRole(['admin']), asyncHandler(ctrl.flagPost));

export default router;

import express from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import * as ctrl from '../controllers/post.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';
import { uploadMultiple } from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/worker/:workerId', (req, res, next) => {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) {
    return verifyToken(req, res, () => ctrl.getWorkerPosts(req, res, next));
  }
  return ctrl.getWorkerPosts(req, res, next);
});
router.post('/', verifyToken, requireRole(['worker']), (req,res,next)=> uploadMultiple(req,res,(err)=>{ if(err) return next(err); next(); }), asyncHandler(ctrl.createPost));
router.patch('/:id', verifyToken, requireRole(['worker']), asyncHandler(ctrl.updatePost));
router.delete('/:id', verifyToken, requireRole(['worker']), asyncHandler(ctrl.deletePost));
router.patch('/:id/flag', verifyToken, requireRole(['admin']), asyncHandler(ctrl.flagPost));

export default router;

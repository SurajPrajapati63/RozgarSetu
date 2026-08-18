import Post from '../models/Post.model.js';
import ApiResponse from '../utils/apiResponse.js';
import { deleteMultipleFromCloudinary } from '../utils/cloudinaryHelper.js';
import mongoose from 'mongoose';
import asyncHandler from '../middleware/asyncHandler.js';

export const getWorkerPosts = asyncHandler(async (req, res) => {
  const { workerId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(workerId)) {
    return ApiResponse.error(res, 'Invalid worker ID', 400);
  }

  const query = { worker: workerId };
  // If not admin and not the owning worker, show only active posts
  if (!req.user || (req.user.role !== 'admin' && req.user.id !== String(workerId))) {
    query.status = 'active';
  }

  const posts = await Post.find(query)
    .sort({ createdAt: -1 })
    .populate('worker', 'name photo workerID category');

  return ApiResponse.success(res, posts);
});

export const createPost = asyncHandler(async (req, res) => {
  const { title, description, category, media: bodyMedia } = req.body;

  let media = [];
  if (req.files && req.files.length > 0) {
    media = req.files.map(f => ({
      url: f.path || f.secure_url || f.url,
      publicId: f.filename || f.public_id || f.publicId,
      type: f.mimetype && f.mimetype.startsWith('video/') ? 'video' : 'image'
    }));
  } else if (bodyMedia && Array.isArray(bodyMedia) && bodyMedia.length > 0) {
    media = bodyMedia.map(m => ({
      url: m.url,
      publicId: m.publicId || m.url,
      type: m.type || 'image'
    }));
  }

  if (media.length === 0) {
    return ApiResponse.error(res, 'At least one media item (image or video) is required', 400);
  }

  const post = await Post.create({
    worker: req.user.id,
    title: title || 'Project Showcase',
    description: description || '',
    category,
    media
  });

  const populated = await Post.findById(post._id).populate('worker', 'name photo workerID category');
  return ApiResponse.success(res, populated, 'Post created successfully', 201);
});

export const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, category } = req.body;

  const post = await Post.findById(id);
  if (!post) return ApiResponse.error(res, 'Post not found', 404);

  if (String(post.worker) !== req.user.id && req.user.role !== 'admin') {
    return ApiResponse.error(res, 'Unauthorized to edit this post', 403);
  }

  if (title !== undefined) post.title = title;
  if (description !== undefined) post.description = description;
  if (category !== undefined) post.category = category;

  await post.save();
  return ApiResponse.success(res, post, 'Post updated successfully');
});

export const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id);
  if (!post) return ApiResponse.error(res, 'Post not found', 404);

  if (String(post.worker) !== req.user.id && req.user.role !== 'admin') {
    return ApiResponse.error(res, 'Unauthorized to delete this post', 403);
  }

  const publicIds = post.media.map(m => m.publicId).filter(Boolean);
  if (publicIds.length > 0) {
    await deleteMultipleFromCloudinary(publicIds);
  }

  await Post.deleteOne({ _id: id });
  return ApiResponse.success(res, { id }, 'Post deleted successfully');
});

export const flagPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const post = await Post.findById(id);
  if (!post) return ApiResponse.error(res, 'Post not found', 404);

  post.status = status || 'flagged';
  await post.save();

  return ApiResponse.success(res, post, `Post status set to ${post.status}`);
});

export default { getWorkerPosts, createPost, updatePost, deletePost, flagPost };

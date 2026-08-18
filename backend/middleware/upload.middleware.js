import multer from 'multer';
import { MAX_FILE_SIZE } from '../config/constants.js';

const storage = multer.memoryStorage();

export const uploadSingle = multer({ storage, limits: { fileSize: MAX_FILE_SIZE } }).single('photo');
export const uploadMultiple = multer({ storage, limits: { fileSize: MAX_FILE_SIZE } }).array('media', 5);
export const uploadVideo = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } }).single('video');

export default { uploadSingle, uploadMultiple, uploadVideo };

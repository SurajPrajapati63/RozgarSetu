import mongoose from 'mongoose';
const { Schema } = mongoose;

const MediaSchema = new Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  type: { type: String, enum: ['image','video'], default: 'image' },
  thumbnail: { type: String }
}, { _id: false });

const PostSchema = new Schema({
  worker: { type: Schema.Types.ObjectId, ref: 'Worker', required: true },
  title: { type: String, required: true, maxlength: 60 },
  description: { type: String, maxlength: 300, default: '' },
  category: { type: String },
  media: [MediaSchema],
  status: { type: String, enum: ['active','flagged','removed'], default: 'active' },
  likes: { type: Number, default: 0 }
}, { timestamps: true });

PostSchema.index({ worker: 1 });
PostSchema.index({ status: 1 });

export default mongoose.model('Post', PostSchema);

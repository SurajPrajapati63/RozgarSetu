import mongoose from 'mongoose';
const { Schema } = mongoose;

const WorkerSchema = new Schema({
  name: { type: String, required: true, trim: true },
  mobile: { type: String, required: true, unique: true, match: /^[0-9]{10}$/ },
  email: { type: String, default: null, lowercase: true, trim: true },
  address: { type: String, required: true, trim: true, maxlength: 500 },
  password: { type: String, required: true, select: false },
  workerID: { type: String, unique: true, required: true },
  role: { type: String, default: 'worker', immutable: true },
  status: { type: String, enum: ['pending', 'active', 'suspended', 'rejected'], default: 'pending' },
  photo: { type: String, default: null },
  photoPublicId: { type: String, default: null },
  bio: { type: String, maxlength: 500, default: '' },
  category: { 
    type: String, 
    enum: ['Plumber', 'Electrician', 'Carpenter', 'Painter', 'AC Repair', 'Cleaning', 'Driver', 'Cook', 'Security Guard', 'Others'], 
    default: 'Others' 
  },
  skills: [{ type: String }],
  city: { type: String, default: 'City' },
  state: { type: String, default: 'State' },
  pricePerDay: { type: Number, required: true, min: 100, default: 500 },
  experience: { type: Number, default: 0 },
  availability: {
    days: [{ type: String, enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }],
    blockedDates: [{ type: Date }],
    isAvailableNow: { type: Boolean, default: true }
  },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  profileViews: { type: Number, default: 0 },
  profileViewers: [{
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    viewedAt: { type: Date, default: Date.now }
  }],
  refreshToken: { type: String, default: null, select: false }
}, { timestamps: true });

WorkerSchema.index({ city: 1 });
WorkerSchema.index({ category: 1 });
WorkerSchema.index({ status: 1 });
WorkerSchema.index({ rating: -1 });

export default mongoose.model('Worker', WorkerSchema);

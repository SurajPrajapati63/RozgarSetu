import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  mobile: { type: String, required: true, unique: true, match: /^[0-9]{10}$/ },
  email: { type: String, default: null, lowercase: true, trim: true },
  address: { type: String, required: true, trim: true, maxlength: 500 },
  password: { type: String, required: true, select: false },
  role: { type: String, default: 'user', immutable: true },
  photo: { type: String, default: null },
  photoPublicId: { type: String, default: null },
  isActive: { type: Boolean, default: true },
  isBanned: { type: Boolean, default: false },
  refreshToken: { type: String, default: null, select: false }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);

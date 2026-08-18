import mongoose from 'mongoose';
const { Schema } = mongoose;

const AdminSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role: { type: String, default: 'admin', immutable: true },
  permissions: [{ type: String }],
  lastLogin: { type: Date },
  refreshToken: { type: String, default: null, select: false }
}, { timestamps: true });

export default mongoose.model('Admin', AdminSchema);

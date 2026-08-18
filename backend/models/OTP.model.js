import mongoose from 'mongoose';
const { Schema } = mongoose;

const OTPSchema = new Schema({
  mobile: { type: String, required: true, match: /^[0-9]{10}$/ },
  otp: { type: String, required: true },
  purpose: { type: String, enum: ['login', 'signup'], required: true },
  attempts: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
  isUsed: { type: Boolean, default: false }
}, { timestamps: true });

// TTL index to automatically remove expired OTP documents after expiresAt
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
OTPSchema.index({ mobile: 1, purpose: 1 });

export default mongoose.model('OTP', OTPSchema);

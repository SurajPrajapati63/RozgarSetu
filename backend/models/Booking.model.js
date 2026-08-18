import mongoose from 'mongoose';
const { Schema } = mongoose;

const BookingSchema = new Schema({
  bookingID: { type: String, unique: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  worker: { type: Schema.Types.ObjectId, ref: 'Worker', required: true },
  serviceDate: { type: Date, required: true },
  serviceDescription: { type: String, required: true, maxlength: 500 },
  contactNumber: { type: String, required: true },
  status: { type: String, enum: ['pending','accepted','completed','cancelled','rejected'], default: 'pending' },
  amount: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  hasReview: { type: Boolean, default: false },
  cancelReason: { type: String, default: null },
  cancelledBy: { type: String, enum: ['user','worker','admin'], default: null }
}, { timestamps: true });

BookingSchema.index({ user: 1 });
BookingSchema.index({ worker: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ serviceDate: 1 });

export default mongoose.model('Booking', BookingSchema);

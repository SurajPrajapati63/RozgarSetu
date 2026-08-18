import mongoose from 'mongoose';
const { Schema } = mongoose;

const AuditLogSchema = new Schema({
  admin: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
  action: { type: String, required: true },
  targetModel: { type: String },
  targetId: { type: Schema.Types.ObjectId },
  details: { type: Object },
  ip: { type: String }
}, { timestamps: true });

export default mongoose.model('AuditLog', AuditLogSchema);

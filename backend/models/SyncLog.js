import mongoose from 'mongoose';

const SyncLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  username: { type: String, required: true },
  status: { type: String, enum: ['success', 'failed'], required: true },
  message: { type: String, default: '' },
  durationMs: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const SyncLog = mongoose.models.SyncLog || mongoose.model('SyncLog', SyncLogSchema);
export default SyncLog;

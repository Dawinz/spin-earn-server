import mongoose, { Document, Schema } from 'mongoose';

export interface ISpinSession extends Document {
  userId: mongoose.Types.ObjectId;
  method: 'free' | 'rewarded';
  outcome: string;
  coins: number;
  signature: string;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
}

const spinSessionSchema = new Schema<ISpinSession>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  method: {
    type: String,
    enum: ['free', 'rewarded'],
    required: true
  },
  outcome: {
    type: String,
    required: true
  },
  coins: {
    type: Number,
    required: true,
    min: 0
  },
  signature: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Indexes
spinSessionSchema.index({ userId: 1, createdAt: -1 });
spinSessionSchema.index({ userId: 1, method: 1, createdAt: -1 });
spinSessionSchema.index({ signature: 1 }, { unique: true });
spinSessionSchema.index({ ipAddress: 1, createdAt: -1 });
spinSessionSchema.index({ createdAt: -1 });

export default mongoose.model<ISpinSession>('SpinSession', spinSessionSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface ISpinSession extends Document {
  userId: Schema.Types.ObjectId;
  deviceId: string;
  ipAddress: string;
  spinResult: {
    segment: number;
    reward: number;
    multiplier: number;
    isJackpot: boolean;
  };
  serverSignature: string;
  timestamp: Date;
  isValid: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const spinSessionSchema = new Schema<ISpinSession>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deviceId: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  spinResult: {
    segment: {
      type: Number,
      required: true
    },
    reward: {
      type: Number,
      required: true
    },
    multiplier: {
      type: Number,
      required: true,
      default: 1
    },
    isJackpot: {
      type: Boolean,
      default: false
    }
  },
  serverSignature: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isValid: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
spinSessionSchema.index({ userId: 1 });
spinSessionSchema.index({ deviceId: 1 });
spinSessionSchema.index({ ipAddress: 1 });
spinSessionSchema.index({ timestamp: 1 });
spinSessionSchema.index({ serverSignature: 1 });

export default mongoose.model<ISpinSession>('SpinSession', spinSessionSchema);

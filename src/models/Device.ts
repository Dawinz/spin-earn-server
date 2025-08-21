import mongoose, { Document, Schema } from 'mongoose';

export interface IDevice extends Document {
  userId: Schema.Types.ObjectId;
  deviceId: string;
  deviceName: string;
  deviceModel: string;
  os: string;
  osVersion: string;
  appVersion: string;
  ipAddress: string;
  userAgent: string;
  fingerprint: string;
  isRooted: boolean;
  isEmulator: boolean;
  isTrusted: boolean;
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
}

const deviceSchema = new Schema<IDevice>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deviceId: {
    type: String,
    required: true
  },
  deviceName: String,
  deviceModel: String,
  os: String,
  osVersion: String,
  appVersion: String,
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: String,
  fingerprint: {
    type: String,
    required: true,
    unique: true
  },
  isRooted: {
    type: Boolean,
    default: false
  },
  isEmulator: {
    type: Boolean,
    default: false
  },
  isTrusted: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
deviceSchema.index({ userId: 1 });
deviceSchema.index({ fingerprint: 1 });
deviceSchema.index({ ipAddress: 1 });
deviceSchema.index({ deviceId: 1 });
deviceSchema.index({ isRooted: 1 });
deviceSchema.index({ isEmulator: 1 });

export default mongoose.model<IDevice>('Device', deviceSchema);

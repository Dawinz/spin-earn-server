import mongoose, { Document, Schema } from 'mongoose';

export interface IDevice extends Document {
  userId: mongoose.Types.ObjectId;
  fingerprintHash: string;
  deviceModel: string;
  os: string;
  emulator: boolean;
  rooted: boolean;
  lastIP: string;
  createdAt: Date;
  updatedAt: Date;
}

const deviceSchema = new Schema<IDevice>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fingerprintHash: {
    type: String,
    required: true
  },
  deviceModel: {
    type: String,
    required: true
  },
  os: {
    type: String,
    required: true
  },
  emulator: {
    type: Boolean,
    default: false
  },
  rooted: {
    type: Boolean,
    default: false
  },
  lastIP: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Indexes
deviceSchema.index({ userId: 1 });
deviceSchema.index({ fingerprintHash: 1 });
deviceSchema.index({ userId: 1, fingerprintHash: 1 }, { unique: true });
deviceSchema.index({ lastIP: 1 });
deviceSchema.index({ emulator: 1 });
deviceSchema.index({ rooted: 1 });

export default mongoose.model<IDevice>('Device', deviceSchema);

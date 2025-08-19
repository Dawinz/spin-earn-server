import mongoose, { Document, Schema } from 'mongoose';

export interface IReferral extends Document {
  inviterId: mongoose.Types.ObjectId;
  inviteeId: mongoose.Types.ObjectId;
  status: 'registered' | 'qualified';
  qualifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const referralSchema = new Schema<IReferral>({
  inviterId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  inviteeId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['registered', 'qualified'],
    default: 'registered'
  },
  qualifiedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
referralSchema.index({ inviterId: 1, createdAt: -1 });
referralSchema.index({ inviteeId: 1 });
referralSchema.index({ inviterId: 1, inviteeId: 1 }, { unique: true });
referralSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model<IReferral>('Referral', referralSchema);

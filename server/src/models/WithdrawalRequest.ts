import mongoose, { Document, Schema } from 'mongoose';

export interface IWithdrawalRequest extends Document {
  userId: Schema.Types.ObjectId;
  amount: number;
  fee: number;
  netAmount: number;
  method: string; // 'paypal', 'bank', 'crypto', etc.
  accountInfo: string; // Encrypted account details
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  processedAt?: Date;
  processedBy?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const withdrawalRequestSchema = new Schema<IWithdrawalRequest>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  fee: {
    type: Number,
    required: true,
    min: 0
  },
  netAmount: {
    type: Number,
    required: true,
    min: 0
  },
  method: {
    type: String,
    required: true,
    enum: ['paypal', 'bank', 'crypto', 'gift_card']
  },
  accountInfo: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminNotes: String,
  processedAt: Date,
  processedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
withdrawalRequestSchema.index({ userId: 1 });
withdrawalRequestSchema.index({ status: 1 });
withdrawalRequestSchema.index({ createdAt: 1 });
withdrawalRequestSchema.index({ processedAt: 1 });

export default mongoose.model<IWithdrawalRequest>('WithdrawalRequest', withdrawalRequestSchema);

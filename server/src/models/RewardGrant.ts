import mongoose, { Document, Schema } from 'mongoose';

export interface IRewardGrant extends Document {
  userId: mongoose.Types.ObjectId;
  reason: 'spin' | 'streak' | 'referral' | 'booster' | 'admin' | 'ssv';
  amount: number;
  metadata: Record<string, any>;
  idempotencyKey?: string;
  createdAt: Date;
}

const rewardGrantSchema = new Schema<IRewardGrant>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    enum: ['spin', 'streak', 'referral', 'booster', 'admin', 'ssv'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  },
  idempotencyKey: {
    type: String,
    sparse: true
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Indexes
rewardGrantSchema.index({ userId: 1, createdAt: -1 });
rewardGrantSchema.index({ userId: 1, reason: 1, createdAt: -1 });
rewardGrantSchema.index({ idempotencyKey: 1 }, { unique: true, sparse: true });
rewardGrantSchema.index({ createdAt: -1 });

export default mongoose.model<IRewardGrant>('RewardGrant', rewardGrantSchema);

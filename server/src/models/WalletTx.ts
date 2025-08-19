import mongoose, { Document, Schema } from 'mongoose';

export interface IWalletTx extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'credit' | 'debit';
  amount: number;
  balanceAfter: number;
  origin: 'spin' | 'streak' | 'referral' | 'booster' | 'admin' | 'ssv' | 'withdrawal';
  referenceId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const walletTxSchema = new Schema<IWalletTx>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  balanceAfter: {
    type: Number,
    required: true
  },
  origin: {
    type: String,
    enum: ['spin', 'streak', 'referral', 'booster', 'admin', 'ssv', 'withdrawal'],
    required: true
  },
  referenceId: {
    type: Schema.Types.ObjectId
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Indexes
walletTxSchema.index({ userId: 1, createdAt: -1 });
walletTxSchema.index({ userId: 1, type: 1, createdAt: -1 });
walletTxSchema.index({ origin: 1, createdAt: -1 });
walletTxSchema.index({ referenceId: 1 });
walletTxSchema.index({ createdAt: -1 });

export default mongoose.model<IWalletTx>('WalletTx', walletTxSchema);

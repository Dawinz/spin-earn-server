import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import config from '../config/index.js';

export interface IUser extends Document {
  email: string;
  password?: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  magicLinkToken?: string;
  magicLinkExpires?: Date;
  isAdmin: boolean;
  isBlocked: boolean;
  isShadowBanned: boolean;
  referralCode: string;
  referredBy?: Schema.Types.ObjectId;
  totalEarnings: number;
  totalWithdrawn: number;
  currentBalance: number;
  dailySpinCount: number;
  lastSpinDate?: Date;
  streakDays: number;
  lastStreakDate?: Date;
  deviceCount: number;
  lastLoginAt?: Date;
  lastLoginIp?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: false, // Optional for magic link auth
    minlength: 6
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  magicLinkToken: String,
  magicLinkExpires: Date,
  isAdmin: {
    type: Boolean,
    default: false
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  isShadowBanned: {
    type: Boolean,
    default: false
  },
  referralCode: {
    type: String,
    required: true,
    unique: true
  },
  referredBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  totalWithdrawn: {
    type: Number,
    default: 0
  },
  currentBalance: {
    type: Number,
    default: 0
  },
  dailySpinCount: {
    type: Number,
    default: 0
  },
  lastSpinDate: Date,
  streakDays: {
    type: Number,
    default: 0
  },
  lastStreakDate: Date,
  deviceCount: {
    type: Number,
    default: 0
  },
  lastLoginAt: Date,
  lastLoginIp: String
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ referralCode: 1 });
userSchema.index({ referredBy: 1 });
userSchema.index({ isBlocked: 1 });
userSchema.index({ isShadowBanned: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !(this as any).password) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(config.BCRYPT_ROUNDS);
    (this as any).password = await bcrypt.hash((this as any).password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!(this as any).password) return false;
  return bcrypt.compare(candidatePassword, (this as any).password);
};

// Reset daily spin count at midnight
userSchema.methods.resetDailySpinCount = function() {
  const now = new Date();
  const lastSpin = this.lastSpinDate;
  
  if (!lastSpin || lastSpin.getDate() !== now.getDate() || 
      lastSpin.getMonth() !== now.getMonth() || 
      lastSpin.getFullYear() !== now.getFullYear()) {
    this.dailySpinCount = 0;
    return true;
  }
  return false;
};

export default mongoose.model<IUser>('User', userSchema);

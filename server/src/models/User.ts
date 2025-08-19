import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  roles: string[];
  referralCode: string;
  referredBy?: string;
  balances: {
    coins: number;
    gems?: number;
  };
  streak: {
    current: number;
    lastClaimDate?: Date;
    longest: number;
  };
  devicePrimaryId?: string;
  flags: {
    shadowBanned: boolean;
    blocked: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateReferralCode(): string;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  passwordHash: {
    type: String,
    required: true
  },
  roles: {
    type: [String],
    default: ['user'],
    enum: ['user', 'admin', 'moderator']
  },
  referralCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  referredBy: {
    type: String,
    ref: 'User'
  },
  balances: {
    coins: {
      type: Number,
      default: 0,
      min: 0
    },
    gems: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  streak: {
    current: {
      type: Number,
      default: 0,
      min: 0
    },
    lastClaimDate: {
      type: Date
    },
    longest: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  devicePrimaryId: {
    type: String
  },
  flags: {
    shadowBanned: {
      type: Boolean,
      default: false
    },
    blocked: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true,
      toJSON: {
      transform: function(doc, ret) {
        if ('passwordHash' in ret) {
          delete (ret as any).passwordHash;
        }
        return ret;
      }
    }
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ referralCode: 1 });
userSchema.index({ 'flags.shadowBanned': 1 });
userSchema.index({ 'flags.blocked': 1 });
userSchema.index({ createdAt: 1 });

// Methods
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

userSchema.methods.generateReferralCode = function(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Pre-save middleware
userSchema.pre('save', async function(next) {
  if (this.isModified('passwordHash')) {
    // Password is already hashed in the service layer
  }
  
  if (this.isNew && !this.referralCode) {
    this.referralCode = this.generateReferralCode();
  }
  
  next();
});

export default mongoose.model<IUser>('User', userSchema);

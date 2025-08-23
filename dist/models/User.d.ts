import mongoose, { Document, Schema } from 'mongoose';
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
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;

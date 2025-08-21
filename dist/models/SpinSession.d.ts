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
declare const _default: mongoose.Model<ISpinSession, {}, {}, {}, mongoose.Document<unknown, {}, ISpinSession, {}, {}> & ISpinSession & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;

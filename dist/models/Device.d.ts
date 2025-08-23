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
declare const _default: mongoose.Model<IDevice, {}, {}, {}, mongoose.Document<unknown, {}, IDevice, {}, {}> & IDevice & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;

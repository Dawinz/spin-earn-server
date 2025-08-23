import mongoose, { Document, Schema } from 'mongoose';
export interface IWithdrawalRequest extends Document {
    userId: Schema.Types.ObjectId;
    amount: number;
    fee: number;
    netAmount: number;
    method: string;
    accountInfo: string;
    status: 'pending' | 'approved' | 'rejected';
    adminNotes?: string;
    processedAt?: Date;
    processedBy?: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IWithdrawalRequest, {}, {}, {}, mongoose.Document<unknown, {}, IWithdrawalRequest, {}, {}> & IWithdrawalRequest & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;

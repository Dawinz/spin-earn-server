import mongoose, { Document, Schema } from 'mongoose';

export interface IConfig extends Document {
  key: string;
  json: Record<string, any>;
  updatedAt: Date;
}

const configSchema = new Schema<IConfig>({
  key: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  json: {
    type: Schema.Types.Mixed,
    required: true
  }
}, {
  timestamps: { createdAt: false, updatedAt: true }
});

export default mongoose.model<IConfig>('Config', configSchema);

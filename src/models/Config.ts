import mongoose, { Document, Schema } from 'mongoose';

export interface IConfig extends Document {
  key: string;
  value: any;
  description?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const configSchema = new Schema<IConfig>({
  key: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: Schema.Types.Mixed,
    required: true
  },
  description: String,
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
configSchema.index({ key: 1 });
configSchema.index({ isPublic: 1 });

export default mongoose.model<IConfig>('Config', configSchema);

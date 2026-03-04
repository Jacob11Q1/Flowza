import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IClient extends Document {
  user: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const clientSchema = new Schema<IClient>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [30, 'Phone cannot exceed 30 characters'],
    },
    company: {
      type: String,
      trim: true,
      maxlength: [100, 'Company cannot exceed 100 characters'],
    },
    notes: {
      type: String,
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },
  },
  { timestamps: true }
);

// Compound index: one user can't have two clients with the same email
clientSchema.index({ user: 1, email: 1 }, { unique: true });

export default mongoose.model<IClient>('Client', clientSchema);

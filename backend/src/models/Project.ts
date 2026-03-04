import mongoose, { Document, Schema, Types } from 'mongoose';

export type ProjectStatus = 'active' | 'completed' | 'on_hold';

export interface IProject extends Document {
  user: Types.ObjectId;
  client: Types.ObjectId;
  name: string;
  description?: string;
  status: ProjectStatus;
  deadline?: Date;
  budget?: number;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: [true, 'Project must be linked to a client'],
    },
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      maxlength: [150, 'Name cannot exceed 150 characters'],
    },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'on_hold'],
      default: 'active',
    },
    deadline: {
      type: Date,
    },
    budget: {
      type: Number,
      min: [0, 'Budget cannot be negative'],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProject>('Project', projectSchema);

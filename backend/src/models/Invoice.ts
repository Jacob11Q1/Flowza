import mongoose, { Document, Schema, Types } from 'mongoose';

export type InvoiceStatus = 'paid' | 'unpaid' | 'overdue';

export interface IInvoice extends Document {
  user: Types.ObjectId;
  client: Types.ObjectId;
  project: Types.ObjectId;
  invoiceNumber: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const invoiceSchema = new Schema<IInvoice>(
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
      required: [true, 'Invoice must be linked to a client'],
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Invoice must be linked to a project'],
    },
    invoiceNumber: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    status: {
      type: String,
      enum: ['paid', 'unpaid', 'overdue'],
      default: 'unpaid',
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
  },
  { timestamps: true }
);

// Auto-generate invoice number before saving
invoiceSchema.pre('save', async function (next) {
  if (this.isNew && !this.invoiceNumber) {
    const count = await mongoose.model('Invoice').countDocuments({ user: this.user });
    this.invoiceNumber = `INV-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

export default mongoose.model<IInvoice>('Invoice', invoiceSchema);

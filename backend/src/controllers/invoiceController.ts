import { Response, NextFunction } from 'express';
import Invoice from '../models/Invoice';
import { AuthRequest } from '../middleware/auth';

// GET /api/invoices
export const getInvoices = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filter: Record<string, unknown> = { user: req.user!._id };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.project) filter.project = req.query.project;
    if (req.query.client) filter.client = req.query.client;

    const invoices = await Invoice.find(filter)
      .populate('client', 'name email')
      .populate('project', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: invoices.length, data: invoices });
  } catch (err) {
    next(err);
  }
};

// GET /api/invoices/:id
export const getInvoice = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, user: req.user!._id })
      .populate('client', 'name email phone')
      .populate('project', 'name budget');

    if (!invoice) {
      res.status(404).json({ success: false, message: 'Invoice not found' });
      return;
    }

    res.json({ success: true, data: invoice });
  } catch (err) {
    next(err);
  }
};

// POST /api/invoices
export const createInvoice = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { client, project, amount, status, dueDate, notes } = req.body;

    if (!client || !project || !amount || !dueDate) {
      res.status(400).json({ success: false, message: 'Client, project, amount, and due date are required' });
      return;
    }

    const invoice = await Invoice.create({
      user: req.user!._id,
      client,
      project,
      amount,
      status: status || 'unpaid',
      dueDate,
      notes,
    });

    const populated = await invoice.populate([
      { path: 'client', select: 'name email' },
      { path: 'project', select: 'name' },
    ]);

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};

// PUT /api/invoices/:id
export const updateInvoice = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, user: req.user!._id },
      req.body,
      { new: true, runValidators: true }
    )
      .populate('client', 'name email')
      .populate('project', 'name');

    if (!invoice) {
      res.status(404).json({ success: false, message: 'Invoice not found' });
      return;
    }

    res.json({ success: true, data: invoice });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/invoices/:id
export const deleteInvoice = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const invoice = await Invoice.findOneAndDelete({ _id: req.params.id, user: req.user!._id });

    if (!invoice) {
      res.status(404).json({ success: false, message: 'Invoice not found' });
      return;
    }

    res.json({ success: true, message: 'Invoice deleted' });
  } catch (err) {
    next(err);
  }
};

import { Response, NextFunction } from 'express';
import Client from '../models/Client';
import { AuthRequest } from '../middleware/auth';

// GET /api/clients
export const getClients = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const clients = await Client.find({ user: req.user!._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: clients.length, data: clients });
  } catch (err) {
    next(err);
  }
};

// GET /api/clients/:id
export const getClient = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const client = await Client.findOne({ _id: req.params.id, user: req.user!._id });
    if (!client) {
      res.status(404).json({ success: false, message: 'Client not found' });
      return;
    }
    res.json({ success: true, data: client });
  } catch (err) {
    next(err);
  }
};

// POST /api/clients
export const createClient = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, phone, company, notes } = req.body;

    if (!name || !email) {
      res.status(400).json({ success: false, message: 'Name and email are required' });
      return;
    }

    const client = await Client.create({
      user: req.user!._id,
      name,
      email,
      phone,
      company,
      notes,
    });

    res.status(201).json({ success: true, data: client });
  } catch (err) {
    next(err);
  }
};

// PUT /api/clients/:id
export const updateClient = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, user: req.user!._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!client) {
      res.status(404).json({ success: false, message: 'Client not found' });
      return;
    }

    res.json({ success: true, data: client });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/clients/:id
export const deleteClient = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const client = await Client.findOneAndDelete({ _id: req.params.id, user: req.user!._id });

    if (!client) {
      res.status(404).json({ success: false, message: 'Client not found' });
      return;
    }

    res.json({ success: true, message: 'Client deleted' });
  } catch (err) {
    next(err);
  }
};

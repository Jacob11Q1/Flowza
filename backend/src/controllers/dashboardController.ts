import { Response, NextFunction } from 'express';
import Client from '../models/Client';
import Project from '../models/Project';
import Invoice from '../models/Invoice';
import { AuthRequest } from '../middleware/auth';

// GET /api/dashboard
// Returns summary stats + recent data + notifications
export const getDashboard = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!._id;

    // Run all queries in parallel for performance
    const [
      totalClients,
      activeProjects,
      allInvoices,
      recentClients,
      recentProjects,
    ] = await Promise.all([
      Client.countDocuments({ user: userId }),
      Project.countDocuments({ user: userId, status: 'active' }),
      Invoice.find({ user: userId }),
      Client.find({ user: userId }).sort({ createdAt: -1 }).limit(5),
      Project.find({ user: userId })
        .populate('client', 'name')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    // Revenue calculations
    const totalRevenue = allInvoices
      .filter((inv) => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.amount, 0);

    const pendingRevenue = allInvoices
      .filter((inv) => inv.status !== 'paid')
      .reduce((sum, inv) => sum + inv.amount, 0);

    const pendingInvoices = allInvoices.filter((inv) => inv.status === 'unpaid').length;

    // Unpaid invoice notifications
    const overdueNotifications = await Invoice.find({
      user: userId,
      status: 'unpaid',
      dueDate: { $lt: new Date() },
    })
      .populate('client', 'name')
      .populate('project', 'name')
      .sort({ dueDate: 1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        stats: {
          totalClients,
          activeProjects,
          pendingInvoices,
          totalRevenue,
          pendingRevenue,
        },
        recentClients,
        recentProjects,
        notifications: overdueNotifications.map((inv) => ({
          id: inv._id,
          type: 'overdue_invoice',
          message: `Invoice ${inv.invoiceNumber} for $${inv.amount.toLocaleString()} is overdue`,
          invoiceNumber: inv.invoiceNumber,
          amount: inv.amount,
          dueDate: inv.dueDate,
          client: inv.client,
          project: inv.project,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
};

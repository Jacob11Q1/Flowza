import { Response, NextFunction } from 'express';
import Project from '../models/Project';
import { AuthRequest } from '../middleware/auth';

// GET /api/projects
export const getProjects = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filter: Record<string, unknown> = { user: req.user!._id };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.client) filter.client = req.query.client;

    const projects = await Project.find(filter)
      .populate('client', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    next(err);
  }
};

// GET /api/projects/:id
export const getProject = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user!._id })
      .populate('client', 'name email phone');

    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

// POST /api/projects
export const createProject = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, client, description, status, deadline, budget } = req.body;

    if (!name || !client) {
      res.status(400).json({ success: false, message: 'Name and client are required' });
      return;
    }

    const project = await Project.create({
      user: req.user!._id,
      client,
      name,
      description,
      status: status || 'active',
      deadline,
      budget,
    });

    const populated = await project.populate('client', 'name email');
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};

// PUT /api/projects/:id
export const updateProject = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.user!._id },
      req.body,
      { new: true, runValidators: true }
    ).populate('client', 'name email');

    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/projects/:id
export const deleteProject = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, user: req.user!._id });

    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    res.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    next(err);
  }
};

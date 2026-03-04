import { Request, Response, NextFunction } from 'express';

export const notFound = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};

export const errorHandler = (
  err: Error & { statusCode?: number; code?: number; keyValue?: Record<string, string> },
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // Mongoose duplicate key error
  if (err.code === 11000 && err.keyValue) {
    const field = Object.keys(err.keyValue)[0];
    message = `A record with this ${field} already exists`;
    statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token';
    statusCode = 401;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

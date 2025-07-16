import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User';

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.role !== 'admin') {
        res.status(403).json({
            success: false,
            message: 'Access denied: Admin only route'
        });
        return;
    }
    next();
};
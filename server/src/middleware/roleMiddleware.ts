import { Response, NextFunction, RequestHandler } from 'express';
import { AuthRequest } from './authMiddleware';

export const authorizeRoles = (...roles: string[]): RequestHandler => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: 'Access Denied: Insufficient permissions'
            });
            return;
        }
        next();
    };
};

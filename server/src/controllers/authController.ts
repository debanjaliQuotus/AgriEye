import { Request, Response } from 'express';
import { IUser } from '../models/User';

interface AuthenticatedRequest extends Request {
    user: IUser & Document;
}

export const verifyToken = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
                phoneNumber: req.user.phoneNumber,
                kyc: req.user.kyc,
            },
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token verification failed",
        });
    }
};

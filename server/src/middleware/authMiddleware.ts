import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayloadUser, UserRole } from '../types/auth';

// Define and export the AuthRequest type
export interface AuthRequest extends Request {
  user?: JwtPayloadUser;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      throw new Error('Invalid token format');
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    // Verify token with correct type assertion
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as Omit<JwtPayloadUser, 'role'> & { role: string };
    
    // Validate role
    if (!isValidRole(decoded.role)) {
      throw new Error('Invalid user role');
    }

    // Add type-safe user info to request
    req.user = {
      ...decoded,
      role: decoded.role as UserRole
    };

   

    next();
  } catch (error) {
    console.error('Authentication error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      headers: req.headers,
      timestamp: new Date().toISOString()
    });

    res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// Helper function to validate roles
function isValidRole(role: string): role is UserRole {
  return ['admin', 'farmer'].includes(role);
}

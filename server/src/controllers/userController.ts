import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { JwtPayloadUser } from '../types/auth.types';

interface RegisterUserRequest {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'farmer';
    aadhaarNumber: string;
    phoneNumber?: string;
    address?: string;
    farmSize?: number;
    cropTypes?: string[];
    location?: {
        latitude?: number;
        longitude?: number;
    };
    createdAt?: Date;
}

interface LoginUserRequest {
    email: string;
    password: string;
}

export const registerUser = async (
    req: Request<{}, {}, RegisterUserRequest>,
    res: Response
): Promise<void> => {
    try {
        const {
            name, email, password, role,
            aadhaarNumber,
            phoneNumber, address, farmSize,
            cropTypes, location
        } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const existingAadhaar = await User.findOne({ aadhaarNumber });
        if (existingAadhaar) {
            res.status(400).json({ message: 'Aadhaar already registered' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name, email, password: hashedPassword, role,
            aadhaarNumber,
            phoneNumber, address, farmSize,
            cropTypes, location
        });

        res.status(201).json({
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            phoneNumber: newUser.phoneNumber,
            aadhaarNumber: newUser.aadhaarNumber
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: error instanceof Error ? error.message : 'Server error' 
        });
    }
};

export const loginUser = async (
    req: Request<{}, {}, LoginUserRequest>,
    res: Response
): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        const payload: JwtPayloadUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            aadhaarNumber: user.aadhaarNumber
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            token,
            user: payload
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: error instanceof Error ? error.message : 'Server error' 
        });
    }
};

export const validateToken = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
            return;
        }

        const user = await User.findById(req.user._id).select('-password');
        
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phoneNumber: user.phoneNumber,
                kyc: user.kyc
            }
        });
    } catch (error) {
        console.error('Token validation error:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Internal server error'
        });
    }
};

export const checkPhoneVerification = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
            return;
        }

        const user = await User.findById(req.user._id);
        
        if (!user) {
            console.log('User not found:', req.user._id);
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            isVerified: user.isPhoneVerified || false,
            phoneNumber: user.phoneNumber,
            lastVerified: user.phoneVerifiedAt
        });
    } catch (error) {
        console.error('Phone verification check failed:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to check phone verification status'
        });
    }
};

export const getFarmers = async (req: Request, res: Response): Promise<void> => {
    try {
        const farmers = await User.find({ role: 'farmer' })
            .select('-password') // Still exclude password
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: farmers.length,
            data: farmers.map(farmer => ({
                id: farmer._id,
                name: farmer.name,
                email: farmer.email,
                phoneNumber: farmer.phoneNumber,
                address: farmer.address,
                farmSize: farmer.farmSize,
                cropTypes: farmer.cropTypes,
                location: farmer.location,
                kyc: farmer.kyc,
                // Add the createdAt field here
                createdAt: farmer.createdAt
            }))
        });
    } catch (error) {
        console.error('Error fetching farmers:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to fetch farmers'
        });
    }
};

import { Request, Response } from 'express';
import Twilio from 'twilio';
import dotenv from 'dotenv';
import crypto from 'crypto';
import User from '../models/User';

dotenv.config();

// In-memory OTP store (replace with Redis or DB in production)
const otpStore = new Map<string, { otp: string; expiresAt: number; attempts: number }>();

const twilioClient = Twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

export const sendOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { phoneNumber } = req.body;
        
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        const message = await twilioClient.messages.create({
            body: `Your verification code is: ${otp}`,
            to: `+91${phoneNumber}`,
            from: process.env.TWILIO_PHONE_NUMBER
        });

        
        otpStore.set(phoneNumber, {
            otp,
            expiresAt: Date.now() + 5 * 60 * 1000,
            attempts: 0
        });

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully'
        });
    } catch (error) {
        console.error('Twilio error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send OTP',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { phoneNumber, otp } = req.body;
        const userId = req.user?._id; // Get user ID from authenticated request

        if (!phoneNumber || !otp || !userId) {
            res.status(400).json({
                success: false,
                message: 'Phone number, OTP and user authentication are required'
            });
            return;
        }

        const record = otpStore.get(phoneNumber);
        
        if (!record) {
            res.status(404).json({
                success: false,
                message: 'No OTP found for this number'
            });
            return;
        }

        const isValidOtp = record.otp === otp;

        if (isValidOtp) {
            // Update both root level and KYC phone verification
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    isPhoneVerified: true,
                    phoneVerifiedAt: new Date(),
                    'kyc.phoneVerified': true,
                    phoneNumber: phoneNumber // Ensure phone number is saved
                },
                { new: true }
            );

            if (!updatedUser) {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }

            otpStore.delete(phoneNumber);

            // Return the verification status in response
            res.status(200).json({
                success: true,
                message: 'Phone number verified successfully',
                data: {
                    isPhoneVerified: true,
                    phoneVerifiedAt: new Date(),
                    phoneNumber: phoneNumber
                }
            });
            return;
        }

        res.status(400).json({
            success: false,
            message: 'Invalid OTP'
        });
    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

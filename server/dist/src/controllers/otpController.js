"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.sendOtp = void 0;
const twilio_1 = __importDefault(require("twilio"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("../models/User"));
dotenv_1.default.config();
// In-memory OTP store (replace with Redis or DB in production)
const otpStore = new Map();
const twilioClient = (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNumber } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const message = yield twilioClient.messages.create({
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
    }
    catch (error) {
        console.error('Twilio error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send OTP',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.sendOtp = sendOtp;
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { phoneNumber, otp } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id; // Get user ID from authenticated request
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
            const updatedUser = yield User_1.default.findByIdAndUpdate(userId, {
                isPhoneVerified: true,
                phoneVerifiedAt: new Date(),
                'kyc.phoneVerified': true,
                phoneNumber: phoneNumber // Ensure phone number is saved
            }, { new: true });
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
    }
    catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
exports.verifyOtp = verifyOtp;

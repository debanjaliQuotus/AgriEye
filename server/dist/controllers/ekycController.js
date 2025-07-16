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
exports.verifyPhone = exports.getEkycStatus = exports.verifyEkyc = void 0;
const User_1 = __importDefault(require("../models/User"));
const path_1 = __importDefault(require("path"));
const verifyEkyc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
            return;
        }
        const files = req.files;
        const userId = req.user._id;
        // Check if phone is verified
        const user = yield User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        // Check both verification fields
        if (!user.isPhoneVerified || (user.kyc && !user.kyc.phoneVerified)) {
            res.status(400).json({
                success: false,
                message: 'Phone number must be verified before completing eKYC',
                verificationStatus: {
                    isPhoneVerified: user.isPhoneVerified,
                    kycPhoneVerified: (_a = user.kyc) === null || _a === void 0 ? void 0 : _a.phoneVerified
                }
            });
            return;
        }
        if (!files.aadhar || !files.pan || !files.selfie) {
            res.status(400).json({
                success: false,
                message: 'All required documents must be provided'
            });
            return;
        }
        // Store relative paths instead of absolute paths
        const documents = {
            aadhar: path_1.default.relative(path_1.default.join(__dirname, '../../'), files.aadhar[0].path),
            pan: path_1.default.relative(path_1.default.join(__dirname, '../../'), files.pan[0].path),
            selfie: path_1.default.relative(path_1.default.join(__dirname, '../../'), files.selfie[0].path)
        };
        yield User_1.default.findByIdAndUpdate(userId, {
            'kyc.status': 'verified',
            'kyc.documents': documents,
            'kyc.verifiedAt': new Date()
        });
        res.status(200).json({
            success: true,
            message: 'eKYC verification completed successfully',
            documents: documents
        });
    }
    catch (error) {
        console.error('eKYC verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process eKYC verification'
        });
    }
});
exports.verifyEkyc = verifyEkyc;
const getEkycStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
            return;
        }
        const user = yield User_1.default.findById(req.user._id).select('kyc');
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: user.kyc
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch eKYC status'
        });
    }
});
exports.getEkycStatus = getEkycStatus;
const verifyPhone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
            return;
        }
        const userId = req.user._id;
        // Update both phone verification fields
        const user = yield User_1.default.findByIdAndUpdate(userId, {
            isPhoneVerified: true,
            phoneVerifiedAt: new Date(),
            'kyc.phoneVerified': true
        }, { new: true } // Return the updated document
        );
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
       
        res.status(200).json({
            success: true,
            message: 'Phone number verified successfully',
            data: {
                isPhoneVerified: user.isPhoneVerified,
                kycPhoneVerified: (_b = user.kyc) === null || _b === void 0 ? void 0 : _b.phoneVerified,
                verifiedAt: user.phoneVerifiedAt
            }
        });
    }
    catch (error) {
        console.error('Phone verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify phone number'
        });
    }
});
exports.verifyPhone = verifyPhone;

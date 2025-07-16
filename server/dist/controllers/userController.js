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
exports.getFarmers = exports.checkPhoneVerification = exports.validateToken = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role, aadhaarNumber, phoneNumber, address, farmSize, cropTypes, location } = req.body;
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const existingAadhaar = yield User_1.default.findOne({ aadhaarNumber });
        if (existingAadhaar) {
            res.status(400).json({ message: 'Aadhaar already registered' });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = yield User_1.default.create({
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
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Server error'
        });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user || !(yield bcryptjs_1.default.compare(password, user.password))) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        const payload = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            aadhaarNumber: user.aadhaarNumber
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            token,
            user: payload
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Server error'
        });
    }
});
exports.loginUser = loginUser;
const validateToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
            return;
        }
        const user = yield User_1.default.findById(req.user._id).select('-password');
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
    }
    catch (error) {
        console.error('Token validation error:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Internal server error'
        });
    }
});
exports.validateToken = validateToken;
const checkPhoneVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
            return;
        }
        const user = yield User_1.default.findById(req.user._id);
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
    }
    catch (error) {
        console.error('Phone verification check failed:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to check phone verification status'
        });
    }
});
exports.checkPhoneVerification = checkPhoneVerification;
const getFarmers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const farmers = yield User_1.default.find({ role: 'farmer' })
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
    }
    catch (error) {
        console.error('Error fetching farmers:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to fetch farmers'
        });
    }
});
exports.getFarmers = getFarmers;

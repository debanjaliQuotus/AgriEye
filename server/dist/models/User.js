"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'farmer'], required: true },
    aadhaarNumber: {
        type: String,
        required: true,
        unique: true,
        match: [/^\d{12}$/, 'Aadhaar must be a 12-digit number']
    },
    phoneNumber: String,
    address: String,
    farmSize: Number,
    cropTypes: [String],
    location: {
        latitude: Number,
        longitude: Number
    },
    isDefaultAdmin: { type: Boolean, default: false },
    kyc: {
        status: {
            type: String,
            enum: ['pending', 'verified', 'rejected'],
            default: 'pending'
        },
        phoneVerified: {
            type: Boolean,
            default: false
        },
        documents: {
            aadhar: String,
            pan: String,
            selfie: String
        },
        verifiedAt: Date,
        remarks: String
    },
    isPhoneVerified: {
        type: Boolean,
        default: false,
        required: true
    },
    phoneVerificationToken: {
        type: String,
        index: true
    },
    phoneVerifiedAt: {
        type: Date
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('User', userSchema);

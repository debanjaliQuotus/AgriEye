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
// Create the Loan schema
const LoanSchema = new mongoose_1.Schema({
    farmer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    purpose: {
        type: String,
        required: true,
        enum: ['seeds', 'equipment', 'irrigation', 'land', 'other']
    },
    term: {
        type: String,
        required: true,
        enum: ['3months', '6months', '1year', '2years', '5years']
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'approved', 'rejected', 'completed'],
        default: 'pending'
    },
    collateral: {
        type: String
    },
    cropType: {
        type: String
    },
    landSize: {
        type: Number
    },
    farmDetails: {
        type: String
    },
    appliedDate: {
        type: Date,
        default: Date.now
    },
    approvedDate: {
        type: Date
    },
    rejectedDate: {
        type: Date
    },
    rejectionReason: {
        type: String
    },
    completedDate: {
        type: Date
    },
    interestRate: {
        type: Number,
        default: 5 // Default interest rate of 5%
    }
});
// Create and export the Loan model
exports.default = mongoose_1.default.model('Loan', LoanSchema);

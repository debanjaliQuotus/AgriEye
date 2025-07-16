"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Insurance = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const insuranceSchema = new mongoose_1.default.Schema({
    farmerId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    insuranceType: { type: String, required: true }, // e.g., "Crop", "Livestock"
    cropType: { type: String },
    landSize: { type: Number },
    premiumAmount: { type: Number, required: true },
    description: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });
exports.Insurance = mongoose_1.default.model('Insurance', insuranceSchema);

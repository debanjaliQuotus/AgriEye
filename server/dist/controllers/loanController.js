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
exports.getLoanStats = exports.updateLoanStatus = exports.getLoanById = exports.getFarmerLoans = exports.getAllLoans = exports.createLoan = void 0;
const express_validator_1 = require("express-validator");
const Loan_1 = __importDefault(require("../models/Loan"));
const createLoan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Not authenticated'
            });
            return;
        }
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
            return;
        }
        const { amount, purpose, term, collateral, cropType, landSize, farmDetails } = req.body;
        const loan = new Loan_1.default({
            farmer: req.user._id,
            amount,
            purpose,
            term,
            collateral,
            cropType,
            landSize,
            farmDetails,
            status: 'pending',
            appliedDate: new Date()
        });
        const savedLoan = yield loan.save();
        res.status(201).json({
            success: true,
            message: 'Loan application submitted successfully',
            data: savedLoan
        });
    }
    catch (error) {
        console.error('Error creating loan:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Error creating loan application'
        });
    }
});
exports.createLoan = createLoan;
// @desc    Get all loans (Admin only)
// @route   GET /api/loans
// @access  Private (Admin only)
const getAllLoans = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loans = yield Loan_1.default.find()
            .populate('farmer', 'name email')
            .sort({ appliedDate: -1 });
        res.status(200).json({
            success: true,
            count: loans.length,
            data: loans
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});
exports.getAllLoans = getAllLoans;
// @desc    Get loans of the logged-in farmer
// @route   GET /api/loans/farmer
// @access  Private (Farmer only)
const getFarmerLoans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const loans = yield Loan_1.default.find({ farmer: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }).sort({ appliedDate: -1 }); // Changed from userId to id
        res.status(200).json({
            success: true,
            count: loans.length,
            data: loans
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});
exports.getFarmerLoans = getFarmerLoans;
// @desc    Get single loan by ID (Admin or Owner Farmer)
// @route   GET /api/loans/:id
// @access  Private
const getLoanById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const loan = yield Loan_1.default.findById(req.params.id)
            .populate('farmer', 'name email');
        if (!loan) {
            res.status(404).json({ success: false, message: 'Loan not found' });
            return;
        }
        // Check access rights
        const isOwner = loan.farmer && typeof loan.farmer === 'object'
            ? loan.farmer._id.toString() === ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) // Changed from userId to id
            : false;
        if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'admin' && !isOwner) {
            res.status(403).json({
                success: false,
                message: 'Not authorized to access this loan'
            });
            return;
        }
        res.status(200).json({ success: true, data: loan });
    }
    catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            res.status(404).json({ success: false, message: 'Loan not found' });
            return;
        }
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});
exports.getLoanById = getLoanById;
// @desc    Update loan status (Admin only)
// @route   PUT /api/loans/:id/status
// @access  Private (Admin only)
const updateLoanStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        const { status, rejectionReason } = req.body;
        const loan = yield Loan_1.default.findById(req.params.id);
        if (!loan) {
            res.status(404).json({ success: false, message: 'Loan not found' });
            return;
        }
        loan.status = status;
        if (status === 'approved') {
            loan.approvedDate = new Date();
        }
        else if (status === 'rejected') {
            loan.rejectedDate = new Date();
            loan.rejectionReason = rejectionReason || 'Application rejected by admin';
        }
        else if (status === 'completed') {
            loan.completedDate = new Date();
        }
        yield loan.save();
        res.status(200).json({ success: true, data: loan });
    }
    catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            res.status(404).json({ success: false, message: 'Loan not found' });
            return;
        }
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});
exports.updateLoanStatus = updateLoanStatus;
// @desc    Get loan statistics (Admin only)
// @route   GET /api/loans/stats
// @access  Private (Admin only)
const getLoanStats = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalLoans = yield Loan_1.default.countDocuments();
        const pendingLoans = yield Loan_1.default.countDocuments({ status: 'pending' });
        const approvedLoans = yield Loan_1.default.countDocuments({ status: 'approved' });
        const rejectedLoans = yield Loan_1.default.countDocuments({ status: 'rejected' });
        const completedLoans = yield Loan_1.default.countDocuments({ status: 'completed' });
        const approvedLoansList = yield Loan_1.default.find({ status: 'approved' });
        const totalApprovedAmount = approvedLoansList.reduce((acc, loan) => acc + loan.amount, 0);
        res.status(200).json({
            success: true,
            data: {
                totalLoans,
                pendingLoans,
                approvedLoans,
                rejectedLoans,
                completedLoans,
                totalApprovedAmount
            }
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});
exports.getLoanStats = getLoanStats;

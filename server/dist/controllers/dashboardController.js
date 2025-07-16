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
exports.getDashboardStats = void 0;
const Loan_1 = __importDefault(require("../models/Loan"));
const User_1 = __importDefault(require("../models/User"));
const Product_1 = __importDefault(require("../models/Product"));
const getDashboardStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        // Get total farmers
        const totalFarmers = yield User_1.default.countDocuments({ role: 'farmer' });
        // Get loan statistics
        const [totalLoans, loanStats] = yield Promise.all([
            Loan_1.default.countDocuments(),
            Loan_1.default.aggregate([
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: '$amount' },
                        pending: {
                            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
                        },
                        approved: {
                            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
                        },
                        rejected: {
                            $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
                        }
                    }
                }
            ])
        ]);
        // Get total products
        const totalProducts = yield Product_1.default.countDocuments();
        const stats = {
            totalFarmers,
            totalLoans,
            totalLoanAmount: ((_a = loanStats[0]) === null || _a === void 0 ? void 0 : _a.totalAmount) || 0,
            totalProducts,
            pendingLoans: ((_b = loanStats[0]) === null || _b === void 0 ? void 0 : _b.pending) || 0,
            approvedLoans: ((_c = loanStats[0]) === null || _c === void 0 ? void 0 : _c.approved) || 0,
            rejectedLoans: ((_d = loanStats[0]) === null || _d === void 0 ? void 0 : _d.rejected) || 0
        };
        res.status(200).json(stats);
    }
    catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching dashboard statistics'
        });
    }
});
exports.getDashboardStats = getDashboardStats;

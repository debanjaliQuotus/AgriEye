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
Object.defineProperty(exports, "__esModule", { value: true });
exports.processCryptoPurchase = exports.processTestPayment = void 0;
const ethers_1 = require("ethers");
const processTestPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { amount, productId, status } = req.body;
        if (!amount || !productId) {
            res.status(400).json({
                success: false,
                message: 'Amount and productId are required'
            });
            return;
        }
        const payment = {
            amount,
            productId,
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
            status,
            createdAt: new Date()
        };
    }
    catch (error) {
        console.error('Test payment error:', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            body: req.body
        });
        res.status(500).json({
            success: false,
            message: 'Error processing test payment',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.processTestPayment = processTestPayment;
const processCryptoPurchase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { productId, amount, txHash } = req.body;
        if (!productId || !amount || !txHash) {
            res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
            return;
        }
        const provider = new ethers_1.ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
        if (!provider) {
            throw new Error('Failed to initialize blockchain provider');
        }
        const transaction = yield provider.getTransaction(txHash);
        if (!transaction) {
            res.status(400).json({
                success: false,
                message: 'Transaction not found on blockchain'
            });
            return;
        }
        const purchase = {
            productId,
            amount,
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
            txHash,
            paymentMethod: 'crypto',
            status: 'completed',
            createdAt: new Date()
        };
        console.log('Processing purchase:', {
            purchase,
            user: req.user,
            txDetails: transaction
        });
        res.status(200).json({
            success: true,
            message: 'Purchase processed successfully',
            data: purchase
        });
    }
    catch (error) {
        console.error('Purchase processing error:', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            body: req.body
        });
        res.status(500).json({
            success: false,
            message: 'Error processing purchase',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.processCryptoPurchase = processCryptoPurchase;

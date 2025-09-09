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
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');
        if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer '))) {
            throw new Error('Invalid token format');
        }
        const token = authHeader.replace('Bearer ', '');
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not configured');
        }
        // Verify token with correct type assertion
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Add type-safe user info to request
        req.user = Object.assign(Object.assign({}, decoded), { role: decoded.role });
        next();
    }
    catch (error) {
        console.error('Authentication error:', {
            error: error instanceof Error ? error.message : 'Unknown error',
            headers: req.headers,
            timestamp: new Date().toISOString()
        });
        res.status(401).json({
            success: false,
            message: 'Authentication failed'
        });
    }
});
exports.authenticate = authenticate;

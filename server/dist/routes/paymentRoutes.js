"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const paymentController_1 = require("../controllers/paymentController");
const router = express_1.default.Router();
// Test payment route
router.post('/test-payment', auth_1.authenticateToken, paymentController_1.processTestPayment);
// Crypto purchase route
router.post('/purchase', auth_1.authenticateToken, paymentController_1.processCryptoPurchase);
exports.default = router;

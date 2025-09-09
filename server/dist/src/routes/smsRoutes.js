"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/notification.js
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const authMiddleware_1 = require("../middleware/authMiddleware");
const smsController_1 = require("../controllers/smsController");
const router = express_1.default.Router();
/**
 * @route POST /api/notifications/sms
 * @desc Send SMS notification to a single recipient
 * @access Private
 */
router.post('/sms', [
    authMiddleware_1.authenticate, // Ensure user is authenticated
    (0, express_validator_1.body)('to').notEmpty().withMessage('Phone number is required'),
    (0, express_validator_1.body)('message').notEmpty().withMessage('Message is required'),
], smsController_1.sendSMS);
/**
 * @route POST /api/notifications/sms/bulk
 * @desc Send SMS notifications to multiple recipients
 * @access Private (Admin only)
 */
router.post('/sms/bulk', [
    authMiddleware_1.authenticate, // Ensure user is authenticated
    // Consider adding admin middleware here to restrict to admin users only
    (0, express_validator_1.body)('recipients').isArray().withMessage('Recipients must be an array of phone numbers'),
    (0, express_validator_1.body)('message').notEmpty().withMessage('Message is required'),
], smsController_1.sendBulkSMS);
exports.default = router;

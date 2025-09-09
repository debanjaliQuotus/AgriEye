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
exports.sendBulkSMS = exports.sendSMS = void 0;
const express_validator_1 = require("express-validator");
const twilio_1 = __importDefault(require("twilio"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Use TWILIO_AUTH_TOKEN instead of API Key/Secret for basic auth
const twilioClient = (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
// Add error handling for missing env variables
if (!process.env.TWILIO_ACCOUNT_SID ||
    !process.env.TWILIO_AUTH_TOKEN ||
    !process.env.TWILIO_PHONE_NUMBER) {
    console.error("Missing required Twilio configuration");
    process.exit(1);
}
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
// Add validation for configuration
const validateTwilioConfig = () => {
    if (!twilioClient) {
        throw new Error("Twilio client not initialized");
    }
    if (!twilioPhoneNumber) {
        throw new Error("Twilio phone number not configured");
    }
};
/**
 * Send SMS notification
 */
const sendSMS = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { to, message } = req.body;
    try {
        validateTwilioConfig();
        let formattedNumber = to;
        if (!to.startsWith("+")) {
            formattedNumber = "+1" + to.replace(/[^0-9]/g, "");
        }
        const smsResponse = yield twilioClient.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: formattedNumber,
        });
        res.status(200).json({
            success: true,
            message: "SMS notification sent successfully",
            sid: smsResponse.sid,
        });
    }
    catch (error) {
        console.error("SMS sending error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send SMS notification",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.sendSMS = sendSMS;
/**
 * Send bulk SMS notifications
 */
const sendBulkSMS = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { recipients, message } = req.body;
    try {
        if (!Array.isArray(recipients) || recipients.length === 0) {
            res.status(400).json({
                success: false,
                message: "Recipients must be a non-empty array of phone numbers",
            });
            return;
        }
        const results = [];
        const failed = [];
        for (const recipient of recipients) {
            try {
                let formattedNumber = recipient;
                if (!recipient.startsWith("+")) {
                    formattedNumber = "+91" + recipient.replace(/[^0-9]/g, "");
                }
                const smsResponse = yield twilioClient.messages.create({
                    body: message,
                    from: twilioPhoneNumber,
                    to: formattedNumber,
                });
                results.push({
                    to: formattedNumber,
                    sid: smsResponse.sid,
                    success: true,
                });
            }
            catch (error) {
                console.error(`Failed to send SMS to ${recipient}:`, error);
                failed.push({
                    to: recipient,
                    error: error instanceof Error ? error.message : "Unknown error",
                    success: false,
                });
            }
        }
        res.status(200).json({
            success: true,
            message: `SMS notifications sent to ${results.length} recipients with ${failed.length} failures`,
            results,
            errors: failed,
        });
    }
    catch (error) {
        console.error("Bulk SMS sending error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to process bulk SMS notifications",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.sendBulkSMS = sendBulkSMS;

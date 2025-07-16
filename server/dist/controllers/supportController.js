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
exports.sendSupportMessage = void 0;
const sendWhatsAppMessage_1 = __importDefault(require("../utils/sendWhatsAppMessage"));
const axios_1 = require("axios");
const sendSupportMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { phoneNumber, supportMessage } = req.body;
        if (!phoneNumber || !supportMessage) {
            res.status(400).json({
                message: 'Phone number and support message are required'
            });
            return;
        }
        // Backend-side sanitation/formatting for phone number
        const cleanedPhoneNumber = phoneNumber.startsWith('+')
            ? phoneNumber.substring(1)
            : phoneNumber;
        yield (0, sendWhatsAppMessage_1.default)(cleanedPhoneNumber, `🛠 Support Request:\n\n${supportMessage}\n\nWe'll get back to you soon.`);
        res.status(200).json({
            message: 'Support request sent via WhatsApp'
        });
    }
    catch (error) {
        console.error('Error sending WhatsApp message:', error);
        if (error instanceof axios_1.AxiosError && ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data)) {
            console.error('WhatsApp API response error data:', error.response.data);
            res.status(500).json({
                message: 'Failed to send support message via WhatsApp API',
                details: error.response.data
            });
        }
        else {
            res.status(500).json({
                message: 'Failed to send support message',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
});
exports.sendSupportMessage = sendSupportMessage;

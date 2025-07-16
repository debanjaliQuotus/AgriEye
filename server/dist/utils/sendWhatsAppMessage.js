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
// utils/sendWhatsAppMessage.ts
const twilio_1 = __importDefault(require("twilio")); // Import the Twilio library
const sendWhatsAppMessage = (toPhoneNumber, message) => __awaiter(void 0, void 0, void 0, function* () {
    // Use environment variables for Twilio credentials
    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN; // Use AUTH_TOKEN for direct API access
    const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER; // Your Twilio WhatsApp-enabled number
    // Basic check for missing environment variables
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
        console.error('Missing Twilio API environment variables. Please check your .env file.');
        throw new Error('Twilio API credentials not configured.');
    }
    // Initialize Twilio client
    // You can use TWILIO_API_KEY_SID and TWILIO_API_KEY_SECRET if you prefer API Keys,
    // but TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN are more common for basic setup.
    const client = (0, twilio_1.default)(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    try {
        // Twilio requires 'whatsapp:' prefix for both 'from' and 'to' numbers for WhatsApp messages
        const formattedTo = `whatsapp:${toPhoneNumber.startsWith('+') ? toPhoneNumber : `+${toPhoneNumber}`}`;
        const formattedFrom = `whatsapp:${TWILIO_PHONE_NUMBER}`;
        // For sending a simple text message
        const result = yield client.messages.create({
            from: formattedFrom, // Your Twilio WhatsApp-enabled number
            to: formattedTo, // The recipient's WhatsApp number
            body: message, // The message content
        });
    }
    catch (error) {
        console.error('Error sending WhatsApp message via Twilio:', error.message);
        // Twilio errors might have specific error codes or additional details
        if (error.status) {
            console.error('Twilio Error Status:', error.status);
            console.error('Twilio Error Code:', error.code);
            console.error('Twilio Error Message:', error.moreInfo);
        }
        throw error; // Re-throw the error for the controller to catch
    }
});
exports.default = sendWhatsAppMessage;

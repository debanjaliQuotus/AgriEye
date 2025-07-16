// controllers/smsController.js
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();


// Define interfaces for request body types
interface SendSMSRequest {
  to: string;
  message: string;
}

interface SendBulkSMSRequest {
  recipients: string[];
  message: string;
}

// Use TWILIO_AUTH_TOKEN instead of API Key/Secret for basic auth
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Add error handling for missing env variables
if (
  !process.env.TWILIO_ACCOUNT_SID ||
  !process.env.TWILIO_AUTH_TOKEN ||
  !process.env.TWILIO_PHONE_NUMBER
) {
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
export const sendSMS = async (
  req: Request<{}, {}, SendSMSRequest>,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);
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

    const smsResponse = await twilioClient.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: formattedNumber,
    });


    res.status(200).json({
      success: true,
      message: "SMS notification sent successfully",
      sid: smsResponse.sid,
    });
  } catch (error) {
    console.error("SMS sending error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send SMS notification",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Send bulk SMS notifications
 */
export const sendBulkSMS = async (
  req: Request<{}, {}, SendBulkSMSRequest>,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);
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

    const results: Array<{ to: string; sid: string; success: boolean }> = [];
    const failed: Array<{ to: string; error: string; success: boolean }> = [];

    for (const recipient of recipients) {
      try {
        let formattedNumber = recipient;
        if (!recipient.startsWith("+")) {
          formattedNumber = "+91" + recipient.replace(/[^0-9]/g, "");
        }

        const smsResponse = await twilioClient.messages.create({
          body: message,
          from: twilioPhoneNumber,
          to: formattedNumber,
        });

        results.push({
          to: formattedNumber,
          sid: smsResponse.sid,
          success: true,
        });
      } catch (error) {
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
  } catch (error) {
    console.error("Bulk SMS sending error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process bulk SMS notifications",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

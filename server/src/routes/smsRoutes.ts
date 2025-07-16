// routes/notification.js
import express from 'express';
import { body } from 'express-validator';
import {authenticate} from '../middleware/authMiddleware';
import { sendSMS, sendBulkSMS } from '../controllers/smsController';

const router = express.Router();

/**
 * @route POST /api/notifications/sms
 * @desc Send SMS notification to a single recipient
 * @access Private
 */
router.post(
  '/sms',
  [
    authenticate, // Ensure user is authenticated
    body('to').notEmpty().withMessage('Phone number is required'),
    body('message').notEmpty().withMessage('Message is required'),
  ],
  sendSMS
);

/**
 * @route POST /api/notifications/sms/bulk
 * @desc Send SMS notifications to multiple recipients
 * @access Private (Admin only)
 */
router.post(
  '/sms/bulk',
  [
    authenticate, // Ensure user is authenticated
    // Consider adding admin middleware here to restrict to admin users only
    body('recipients').isArray().withMessage('Recipients must be an array of phone numbers'),
    body('message').notEmpty().withMessage('Message is required'),
  ],
  sendBulkSMS
);

export default router;
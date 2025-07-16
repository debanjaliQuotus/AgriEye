import { createApiClient, ENDPOINTS, ApiError } from '../config/api';
import { AxiosError } from 'axios';

// Add interfaces for better type safety
interface NotificationRequest {
  to: string;
  message: string;
}

interface NotificationResponse {
  success: boolean;
  message: string;
  data?: {
    messageId: string;
    status: string;
  };
}

interface DetectedObject {
  label: string;
  confidence: number;
}

export const NOTIFICATION_ENDPOINTS = {
  SEND_SMS: '/notification/sms',
  SEND_BULK_SMS: '/notification/sms/bulk',
  ...ENDPOINTS
};

export const notificationService = {
  sendSMS: async (to: string, message: string): Promise<NotificationResponse> => {
    try {
      if (!to || !message) {
        throw new Error('Phone number or message is missing');
      }

      const token = localStorage.getItem('token');
      const apiClient = createApiClient(token || '');

      const payload: NotificationRequest = { to, message };
      const response = await apiClient.post<NotificationResponse>(
        NOTIFICATION_ENDPOINTS.SEND_SMS, 
        payload
      );

      return response.data;
    } catch (error: unknown) {
      // Type guard for AxiosError with ApiError response type
      if (error instanceof AxiosError && error.response?.data) {
        const apiError = error.response.data as ApiError;
        throw new Error(apiError.message || 'Failed to send SMS');
      }
      // Generic error handling
      throw new Error(
        'Failed to send SMS: ' + 
        (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  },

  sendMotionDetectionNotification: async (
    phoneNumber: string,
    objects: DetectedObject[],
    timestamp: string
  ): Promise<void> => {
    if (!phoneNumber) {
      console.error('No phone number provided for notification');
      return;
    }

    const formattedTime = new Date(timestamp).toLocaleString();

    // Build message with detected objects
    let objectsList = '';
    if (objects && objects.length > 0) {
      objectsList = objects
        .map((obj) => `${obj.label} (${(obj.confidence * 100).toFixed(0)}%)`)
        .join(', ');
    } else {
      objectsList = 'Unknown object';
    }

    const message = `Motion detected at ${formattedTime}. Objects detected: ${objectsList}`;

    try {
      await notificationService.sendSMS(phoneNumber, message);
    } catch (error: unknown) {
      console.error(
        'Failed to send motion detection notification:', 
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  },
};

export default notificationService;

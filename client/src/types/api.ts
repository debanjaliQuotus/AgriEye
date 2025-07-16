
// Remove the custom UploadProgressEvent interface and use AxiosProgressEvent instead
export interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
      code?: number;
      success?: boolean;
      verificationToken?: string;
    };
    status?: number;
  };
}

export interface VerificationResponse {
  success: boolean;
  isVerified: boolean;
  verificationToken?: string;
  message?: string;
}
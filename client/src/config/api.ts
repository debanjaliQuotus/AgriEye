import axios, {  AxiosError } from "axios";

// Ensure base URL ends with /api
export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

export const ENDPOINTS = {
  // Auth endpoints
  LOGIN: "/users/login",
  REGISTER: "/users/register",
  VERIFY_TOKEN: "/users/validate",
  CHECK_PHONE_VERIFICATION: '/users/phone-verification-status',

  // Product endpoints
  GET_PRODUCTS: '/products',
  CREATE_PRODUCT: '/products',
  UPDATE_PRODUCT: (id: string) => `/products/${id}`,
  DELETE_PRODUCT: (id: string) => `/products/${id}`,
  GET_PRODUCT: (id: string) => `/products/${id}`,

  // Loan endpoints
  CREATE_LOAN: "/loans",
  GET_FARMER_LOANS: "/loans/farmer",
  GET_ALL_LOANS: "/loans",
  GET_LOAN_BY_ID: (id: string) => `/loans/${id}`,
  UPDATE_LOAN_STATUS: (id: string) => `/loans/${id}/status`,
  GET_LOAN_STATS: "/loans/stats",

  // Subsidy endpoints
  CREATE_SUBSIDY: "/subsidy/apply",
  GET_MY_SUBSIDIES: "/subsidy/my",
  GET_ALL_SUBSIDIES: "/subsidy/all",
  UPDATE_SUBSIDY_STATUS: (id: string) => `/subsidy/${id}/status`,

  // Insurance endpoints
  APPLY_INSURANCE: "/insurance/apply",
  GET_MY_INSURANCE: "/insurance/my",
  GET_ALL_INSURANCE: "/insurance/all",
  UPDATE_INSURANCE_STATUS: (id: string) => `/insurance/${id}/status`,

  // Dashboard endpoints
  GET_DASHBOARD_STATS: "/admin/dashboard/stats",
  GET_FARMERS: "/users/farmers",

  // eKYC endpoints
  VERIFY_EKYC: '/ekyc/verify',
  GET_EKYC_STATUS: "/ekyc/status",

  // Payment endpoints
  TEST_PAYMENT: "/payments/test-payment",
  PURCHASE: "/payments/purchase",
  PREDICT_PRICE: "/products/predict-price", // Remove the /api prefix

  // Motion Event endpoints
  GET_MOTION_EVENTS: "/motion",

  // OTP endpoints
  SEND_OTP: 'otp/send-otp',
  VERIFY_OTP: 'otp/verify-otp',  // Update this from /api/otp/verify-otp
};

// Global API error handler
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;

    if (axiosError.response) {
      return axiosError.response.data?.message || axiosError.message;
    }

    if (axiosError.request) {
      return "Network error. Please check your connection.";
    }

    return axiosError.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
};

// Authenticated Axios client creator
export const createApiClient = (token?: string) => {
  const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  });

  // Add request interceptor to handle auth
  client.interceptors.request.use((config) => {
    return config;
  });

  // Add response interceptor to handle errors
  client.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        console.error('Auth error details:', {
          config: error.config,
          status: error.response.status,
          headers: error.response.headers
        });
      }
      return Promise.reject(error);
    }
  );

  return client;
};

// Add this new type file for API related types
export interface UploadProgressEvent {
  loaded: number;
  total: number;
}

export interface ApiError {
  message: string;
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

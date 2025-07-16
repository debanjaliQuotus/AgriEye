import { Document } from 'mongoose';
import { IUser } from '../models/User';

declare global {
    namespace Express {
        interface Request {
            user?: IUser & Document;
        }
    }
}

export interface PaymentRequest {
    amount: number;
    productId: string;
    status: 'success' | 'failed';
}

export interface CryptoPaymentRequest {
    productId: string;
    amount: number;
    txHash: string;
    paymentMethod: 'crypto';
}